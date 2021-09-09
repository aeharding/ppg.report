import { detect } from "detect-browser";
import { isInstalled } from "./helpers/device";

const device = detect();

// Installed apps shouldn't zoom to appear more native
// But in the browser, zooming is expected. Apple overrides,
// but Android respects, so we need the below for Android.
const viewport = document.querySelector("meta[name=viewport]");
if (viewport && !isInstalled())
  viewport.setAttribute(
    "content",
    "width=device-width, initial-scale=1, viewport-fit=cover"
  );

// Theme color on Android is used for the status bar when installed.
// Unfortunately, Android PWAs can't be configured to render from the
// very top
const theme = document.querySelector("meta[name=theme-color]");
if (
  theme &&
  isInstalled() &&
  (device?.os === "android" || device?.os === "Android OS")
)
  theme.setAttribute("content", "#000C18");
