import {
  Alert,
  isGAirmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "../features/alerts/alertsSlice";
import { OnOff } from "../features/rap/extra/settings/settingEnums";
import { RootState } from "../store";

export function getAlertId(alert: Alert): string {
  if (isWeatherAlert(alert)) return alert.properties.id;

  if (isTFRAlert(alert)) return alert.properties.coreNOTAMData.notam.id;

  return `aviationalert-${alert.id}`;
}

export function isAlertRead(
  alert: Alert,
  userState: RootState["user"]
): boolean {
  if (userState.gAirmetRead === OnOff.On && isGAirmetAlert(alert)) return true;

  return !!userState.readAlerts[getAlertId(alert)];
}
