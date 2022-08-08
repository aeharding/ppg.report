export function isTouchDevice(): boolean {
  return window.matchMedia("(any-hover: none)").matches;
}

function parseCookies(): Record<string, string | undefined> {
  return Object.fromEntries(
    document.cookie.split("; ").map((x) => x.split("="))
  );
}

const pwaBuilderCookie = parseCookies()["app-platform"];

export function isInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    pwaBuilderCookie === "iOS App Store"
  );
}
