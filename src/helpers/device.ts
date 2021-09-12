import { detect } from "detect-browser";

const browser = detect();

export function isTouchDevice(): boolean {
  return window.matchMedia("(any-hover: none)").matches;
}

export function isInstalled(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * If the browser is capable of scrolling the snap body,
 * this will allow the hour header to be sticky.
 */
export function canScrollSnapBody(): boolean {
  return isTouchDevice() && !(browser?.name === "firefox" || safari14OrOlder());
}

export function safari14OrOlder(): boolean {
  return browser?.name === "safari" && +browser?.version.split(".")[0] <= 14;
}
