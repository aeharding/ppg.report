import sortBy from "lodash/sortBy";
import {
  Alert,
  isGAirmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";
import { GAirmetFeature } from "../services/aviationWeather";
import { extractIssuedTimestamp } from "./aviationAlerts";

export function isAlertDangerous(alert: Alert): boolean {
  if (isWeatherAlert(alert))
    return (
      !alert.properties.headline?.includes("Watch") &&
      (alert.properties.severity === "Extreme" ||
        alert.properties.severity === "Severe")
    );

  if (isTFRAlert(alert)) return true;

  if (isGAirmetAlert(alert) && alert.properties.hazard === "LLWS") return true;

  return (
    alert.properties.data === "SIGMET" &&
    alert.properties.airSigmetType !== "OUTLOOK"
  );
}

/**
 * Most severe first
 */
export function sortAlerts(alerts: Alert[]): Alert[] {
  return sortBy(alerts, (alert) => {
    if (isWeatherAlert(alert))
      return -new Date(alert.properties.sent).getTime();

    if (isTFRAlert(alert))
      return -new Date(alert.properties.coreNOTAMData.notam.issued).getTime();

    return -new Date(extractIssuedTimestamp(alert));
  });
}

/**
 * Try to format out some of the random line breaks the
 * National Weather Service includes (for fixed width displays)
 * that doesn't work well for mobile
 *
 * Try to preserve all sensible line breaks
 */
export function undoFixedWidthText(text: string): string {
  return text.replace(/([^\n\\.])(\n)([^\n])/g, "$1 $3");
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
  alerts: Alert[]
): GAirmetFeature[] {
  if (!isGAirmetAlert(alert)) return [];

  const potential = alerts.filter((potentialAlert) => {
    if (!isGAirmetAlert(potentialAlert)) return false;

    return potentialAlert.properties.hazard === alert.properties.hazard;
  }) as GAirmetFeature[];

  const baseAlertIndex = potential.findIndex(
    (potentialAlert) => potentialAlert.id === alert.id
  );

  if (baseAlertIndex === -1) return [alert];

  potential.sort(
    (a, b) =>
      Date.parse(a.properties.issueTime) - Date.parse(b.properties.issueTime)
  );

  return [
    ...findPrev(alert, potential.slice(0, baseAlertIndex)),
    alert,
    ...findNext(alert, potential.slice(baseAlertIndex + 1)),
  ];

  function findNext(
    alert: GAirmetFeature,
    alerts: GAirmetFeature[]
  ): GAirmetFeature[] {
    const ret: GAirmetFeature[] = [];
    let forecast = +alert.properties.forecast;

    for (const alert of alerts) {
      forecast = forecast + 3;
      if (+alert.properties.forecast !== forecast) return ret;
      ret.push(alert);
    }

    return ret;
  }

  function findPrev(
    alert: GAirmetFeature,
    alerts: GAirmetFeature[]
  ): GAirmetFeature[] {
    const ret: GAirmetFeature[] = [];
    let forecast = +alert.properties.forecast;

    for (const alert of alerts.reverse()) {
      forecast = forecast - 3;
      if (+alert.properties.forecast !== forecast) return ret;
      ret.push(alert);
    }

    return ret.reverse();
  }
}
