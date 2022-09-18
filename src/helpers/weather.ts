import sortBy from "lodash/sortBy";
import {
  Alert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";

export function isAlertDangerous(alert: Alert): boolean {
  if (isWeatherAlert(alert))
    return (
      !alert.properties.headline?.includes("Watch") &&
      (alert.properties.severity === "Extreme" ||
        alert.properties.severity === "Severe")
    );

  if (isTFRAlert(alert)) return true;

  return alert.properties.type !== "OUTLOOK";
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

    return -new Date(alert.properties.from);
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
