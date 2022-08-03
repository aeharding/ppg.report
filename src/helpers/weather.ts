import { Feature } from "../features/weather/weatherSlice";

export function isAlertDangerous(alert: Feature): boolean {
  return (
    !alert.properties.headline?.includes("Watch") &&
    (alert.properties.severity === "Extreme" ||
      alert.properties.severity === "Severe")
  );
}
