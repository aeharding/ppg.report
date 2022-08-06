import { Feature } from "../features/weather/weatherSlice";

export function isAlertDangerous(alert: Feature): boolean {
  return (
    !alert.properties.headline?.includes("Watch") &&
    (alert.properties.severity === "Extreme" ||
      alert.properties.severity === "Severe")
  );
}

/**
 * Most severe first
 */
export function alertsBySeveritySortFn(a: Feature, b: Feature): number {
  return (isAlertDangerous(b) ? 1 : 0) - (isAlertDangerous(a) ? 1 : 0);
}
