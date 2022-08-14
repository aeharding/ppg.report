import { doesFontExist } from "./fontDetect";

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

export function isInApp(): boolean {
  const rules = ["WebView", "(iPhone|iPod|iPad)(?!.*Safari/)", "Android.*(wv)"];
  const regex = new RegExp(`(${rules.join("|")})`, "ig");
  return (
    Boolean(navigator.userAgent.match(regex)) || isSFSafariViewController()
  );
}

export function isThirdPartyIosBrowser() {
  return (
    navigator.userAgent.includes("CriOS") ||
    navigator.userAgent.includes("FxiOS")
  );
}

/**
 * Important: Must check to make sure UA is Safari first
 */
export function isSFSafariViewController(): boolean {
  // In SFSafariViewController, this is a valid font.
  // This might break in future iOS versions...
  return doesFontExist(".Helvetica LT MM");
}
