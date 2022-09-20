import sortBy from "lodash/sortBy";
import {
  Alert,
  isGAirmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";
import { extractIssued } from "../services/aviationWeather";

export function isAlertDangerous(alert: Alert): boolean {
  if (isWeatherAlert(alert))
    return (
      !alert.properties.headline?.includes("Watch") &&
      (alert.properties.severity === "Extreme" ||
        alert.properties.severity === "Severe")
    );

  if (isTFRAlert(alert)) return true;

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

    return -new Date(extractIssued(alert));
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

export function findRelatedAlerts(alert: Alert, alerts: Alert[]): Alert[] {
  if (!isGAirmetAlert(alert)) return [];

  return alerts.filter((potentialAlert) => {
    if (!isGAirmetAlert(potentialAlert)) return false;
    if (potentialAlert.id === alert.id) return false;

    return potentialAlert.properties.hazard === alert.properties.hazard;
  });
}
