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
