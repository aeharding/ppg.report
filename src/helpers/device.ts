import { doesFontExist } from "./fontDetect";

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function isLandscape(): boolean {
  return window.matchMedia("(orientation: landscape)").matches;
}

export const FIXED_HEADER_MEDIAQUERY =
  "(orientation: landscape) and (max-height: 500px)";

export function headerIsFixed(): boolean {
  return isInstalled() && !window.matchMedia(FIXED_HEADER_MEDIAQUERY).matches;
}

function parseCookies(): Record<string, string | undefined> {
  return Object.fromEntries(
    document.cookie.split("; ").map((x) => x.split("=")),
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
 * Is mobile device, or iPad-like
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    navigator.userAgent,
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

export function isBrowserLocaleClockType24h(
  languages: string | string[] = navigator.language,
): boolean {
  // "In basic use without specifying a locale, DateTimeFormat
  // uses the default locale and default options."
  // Ref: developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_datetimeformat
  // To be sure of the browser's language (set by the user
  // and may be different than the operating system's default language)
  // set the 'languages' parameter to 'navigator.language'.
  // E.g. isBrowserLocaleClockType24h(navigator.language);
  if (!languages) {
    languages = [];
  }

  // The value of 'hr' will be in the format '0', '1', ... up to '24'
  // for a 24-hour clock type (depending on a clock type of
  // 'h23' or 'h24'. See:
  // developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
  // Intl.Locale.prototype.hourCycles
  // Returns an Array of hour cycle identifiers, indicating either
  // the 12-hour format ("h11", "h12") or
  // the 24-hour format ("h23", "h24").

  // A 12-hour clock type value has the format '7 AM', '10 PM', or
  // '7 π.μ.' (if the locale language is Greek as specified
  // by the two letter ISO 639-1 code "el" or
  // three letter ISO 639-2 code "ell").

  const hr = new Intl.DateTimeFormat(languages, { hour: "numeric" }).format();

  // If there's no space in the value of the 'hr' variable then
  // the value is a string representing a number between and
  // can include '0' and '24'. See comment above regarding "hourCycles".
  // Return 'true' if a space exists.
  //if (!hr.match(/\s/)) { return true; }
  // Or simply:
  // return !hr.match(/\s/);

  // Alternatively, check if the value of 'hr' is an integer.
  // E.g. Number.isInteger(Number('10 AM')) returns 'false'
  // E.g. Number.isInteger(Number('7 π.μ.')) returns 'false'
  // E.g. Number.isInteger(Number('10')) returns 'true'
  return Number.isInteger(Number(hr));
}
