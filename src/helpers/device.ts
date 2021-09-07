export function isTouchDevice(): boolean {
  return window.matchMedia("(any-hover: none)").matches;
}

export function isInstalled(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}
