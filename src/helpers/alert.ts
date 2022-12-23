import {
  Alert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";

export function getAlertId(alert: Alert): string {
  if (isWeatherAlert(alert)) return alert.properties.id;

  if (isTFRAlert(alert)) return alert.properties.coreNOTAMData.notam.id;

  return `aviationalert-${alert.id}`;
}
