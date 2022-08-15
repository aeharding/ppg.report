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
  const iosVersion = getIosVersion();

  if (!iosVersion || iosVersion[0] < 15) return false;

  // In SFSafariViewController, this is a valid font.
  // This might break in future iOS versions...
  return doesFontExist(".Helvetica LT MM");
}

function getIosVersion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (!v) return;
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] ?? 0, 10)];
  }
}
