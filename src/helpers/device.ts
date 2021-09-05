export function isTouchDevice(): boolean {
  return window.matchMedia("(any-hover: none)").matches;
}
