import { addHours } from "date-fns";
import { sortBy } from "es-toolkit";
import {
  Alert,
  isGAirmetAlert,
  isISigmetAlert,
  isSigmetOutlookAlert,
  isSigmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";
import { GAirmetFeature } from "../services/aviationWeather";
import { extractIssuedTimestamp } from "./aviationAlerts";
import { OnOff } from "../features/rap/extra/settings/settingEnums";

export function isAlertDangerous(alert: Alert): boolean {
  if (isWeatherAlert(alert))
    return (
      !alert.properties.headline?.includes("Watch") &&
      (alert.properties.severity === "Extreme" ||
        alert.properties.severity === "Severe")
    );

  if (isTFRAlert(alert)) return true;

  if (isISigmetAlert(alert)) return true;

  if (isSigmetOutlookAlert(alert)) return false;
  if (isSigmetAlert(alert)) return true;

  return false;
}

/**
 * Most severe first
 */
export function sortAlerts(
  alerts: Alert[],
  allAlerts: Alert[],
  gAirmetRead: OnOff,
): Alert[] {
  const DANGEROUS_OFFSET = 0;
  const NON_DANGEROUS_OFFSET = 1e15;
  const GAIRMET_READ_OFFSET = 2e15;

  return sortBy(alerts, [
    (alert) => {
      const dangerousPrefix = isAlertDangerous(alert)
        ? DANGEROUS_OFFSET
        : NON_DANGEROUS_OFFSET;

      // If the setting for always marking G-Airmets as read is on,
      // push all G-Airmets to the bottom of the list of alerts
      if (gAirmetRead === OnOff.On && isGAirmetAlert(alert))
        return (
          -new Date(
            extractIssuedTimestamp(alert, findRelatedAlerts(alert, allAlerts)),
          ).getTime() + GAIRMET_READ_OFFSET
        );

      if (isWeatherAlert(alert))
        return -new Date(alert.properties.onset).getTime() + dangerousPrefix;

      if (isTFRAlert(alert))
        return (
          -new Date(
            alert.properties.coreNOTAMData.notam.effectiveStart,
          ).getTime() + dangerousPrefix
        );

      return (
        -new Date(
          extractIssuedTimestamp(alert, findRelatedAlerts(alert, allAlerts)),
        ).getTime() + dangerousPrefix
      );
    },
  ]);
}

/**
 * Try to format out some of the random line breaks the
 * National Weather Service includes (for fixed width displays)
 * that doesn't work well for mobile
 *
 * Try to preserve all sensible line breaks
 */
export function undoFixedWidthText(text: string): string {
  return text
    .replace(/([^\n\\.-])(\n)([^\n])/g, "$1 $3") // match newline where line not ending in "\", "-" or "."
    .replace(/([^\n\\.])(\n)([^\n])/g, "$1$3"); // line ending in dash shouldn't have a space
}

/**
 * Need to find alerts that are side-by-side and of the same hazard.
 * For example, G-AIRMETS are issued in 3 hour chunks
 * (relative time index 0, 3, 6, 9 - represented in alert.properties.forecast)
 *
 * Only applies to G-AIRMET alert types.
 *
 * @param alert
 * @param alerts
 * @returns
 */
export function findRelatedAlerts(
  alert: Alert,
  alerts: Alert[],
): GAirmetFeature[] {
  if (!isGAirmetAlert(alert)) return [];

  const potential = alerts.filter((potentialAlert) => {
    if (!isGAirmetAlert(potentialAlert)) return false;

    return (
      potentialAlert.properties.hazard === alert.properties.hazard &&
      potentialAlert.properties.severity === alert.properties.severity
    );
  }) as GAirmetFeature[];

  potential.sort(
    (a, b) =>
      Date.parse(a.properties.issueTime) - Date.parse(b.properties.issueTime),
  );

  const baseAlertIndex = potential.findIndex(
    (potentialAlert) => potentialAlert.id === alert.id,
  );

  if (baseAlertIndex === -1) return [alert];

  return [
    ...findPrev(alert, potential.slice(0, baseAlertIndex)),
    alert,
    ...findNext(alert, potential.slice(baseAlertIndex + 1)),
  ];

  function findNext(
    alert: GAirmetFeature,
    alerts: GAirmetFeature[],
  ): GAirmetFeature[] {
    const ret: GAirmetFeature[] = [];
    let validTime = new Date(alert.properties.validTime);

    for (const alert of alerts) {
      validTime = addHours(validTime, 3);
      if (Date.parse(alert.properties.validTime) !== validTime.getTime())
        return ret;
      ret.push(alert);
    }

    return ret;
  }

  function findPrev(
    alert: GAirmetFeature,
    alerts: GAirmetFeature[],
  ): GAirmetFeature[] {
    const ret: GAirmetFeature[] = [];
    let validTime = new Date(alert.properties.validTime);

    for (const alert of alerts.reverse()) {
      validTime = addHours(validTime, -3);
      if (Date.parse(alert.properties.validTime) !== validTime.getTime())
        return ret;
      ret.push(alert);
    }

    return ret.reverse();
  }
}
