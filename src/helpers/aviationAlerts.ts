import sortBy from "lodash/sortBy";
import {
  isGAirmetAlert,
  isISigmetAlert,
  isSigmetOutlookAlert,
  isSigmetAlert,
} from "../features/alerts/alertsSlice";
import {
  AviationAlertFeature,
  CwaFeature,
  GAirmetFeature,
  ISigmetFeature,
  SigmetFeature,
} from "../services/aviationWeather";
import { notEmpty } from "./array";
import { capitalizeFirstLetter } from "./string";

export function getAviationAlertName(alert: AviationAlertFeature): string {
  if (isSigmetAlert(alert)) {
    return getSigmetAlertName(alert);
  }

  if (isISigmetAlert(alert)) {
    return getISigmetAlertName(alert);
  }

  if (isGAirmetAlert(alert)) {
    return getGAirmetAlertName(alert);
  }

  return getCwaAlertName(alert);
}

function getSigmetAlertName(alert: SigmetFeature): string {
  if (isSigmetOutlookAlert(alert))
    return `${formatHazard(alert.properties.hazard)} SIGMET Outlook`;

  return [formatHazard(alert.properties.hazard), getSigmetAlertType(alert)]
    .filter((a) => a)
    .join(" ");
}

function getISigmetAlertName(alert: ISigmetFeature): string {
  return [
    alert.properties.firId,
    formatQualifier(
      alert.properties.qualifier as CwaFeature["properties"]["qualifier"],
    ) ?? alert.properties.qualifier,
    formatHazard(alert.properties.hazard),
    "SIGMET",
  ]
    .filter((a) => a)
    .join(" ");
}

function getSigmetAlertType(alert: SigmetFeature): string {
  return alert.properties.airSigmetType;
}

function getGAirmetAlertName(alert: GAirmetFeature): string {
  return [
    formatSeverity(alert.properties.severity),
    formatHazard(alert.properties.hazard),
    "G‑AIRMET",
  ]
    .filter(notEmpty)
    .map(capitalizeFirstLetter)
    .join(" ");
}

function getCwaAlertName(alert: CwaFeature): string {
  return `${alert.properties.cwsu} CWA: ${[
    formatQualifier(alert.properties.qualifier),
    formatHazard(alert.properties.hazard),
  ].join(" ")}`;
}

function formatHazard(
  hazard: AviationAlertFeature["properties"]["hazard"],
): string {
  switch (hazard) {
    case "ASH":
      return "Ash";
    case "CONVECTIVE":
      return "Convective";
    case "ICE":
    case "ICING":
      return "Icing";
    case "IFR":
      return "IFR";
    case "MTN OBSCN":
    case "MT_OBSC":
      return "Mountain Obstruction";
    case "TURB":
    case "TURB-LO":
    case "TURB-HI":
      return "Turbulence";
    case "PCPN":
      return "Precipitation";
    case "TS":
      return "Thunderstorms";
    case "LLWS":
      return "Low-Level Wind Shear";
    case "SFC_WND":
      return "Strong Surface Winds";
    case "FZLVL":
      return "Freezing Level";
    case "M_FZLVL":
      return "Multiple freezing levels";
    case "VA":
      return "Volcanic Ash";
    case "DS":
      return "Duststorm";
    case "SS":
      return "Sandstorm";
    case "MTW":
      return "Mountain wave";
    case "TSGR":
      return "Thunderstorms with hail";
    case "TC":
      return "Tropical Cyclone";
  }
}

function formatQualifier(
  qualifier:
    | CwaFeature["properties"]["qualifier"]
    | ISigmetFeature["properties"]["qualifier"],
): string {
  switch (qualifier) {
    case "EMBD":
      return "Embedded";
    case "ISOL":
      return "Isolated";
    case "MOD":
      return "Moderate";
    case "SEV":
      return "Severe";
    case "FRQ":
      return "Frequent";
    case "SQL":
      return "Squall line";
    case "HVY":
      return "Heavy";
    case "RDOACT CLD":
      return "Radioactive Cloud";
    case "OBSC":
      return "Obscured";
  }
}

export function extractIssuedTimestamp(
  alert: AviationAlertFeature,
  relatedAlerts: GAirmetFeature[],
): string {
  if (isSigmetAlert(alert)) {
    const iss = alert.properties.rawAirSigmet.split("\n")[0].split(" ")[2];
    if (!iss || iss.length !== 6) return alert.properties.validTimeFrom;

    const day = +iss.slice(0, 2);
    const hour = +iss.slice(2, 4);
    const minute = +iss.slice(4, 6);

    let year: number;
    let month: number;

    const from = new Date(alert.properties.validTimeFrom);

    // Derive the year and month from the validTimeFrom

    // May be issued on the 31st, but validity starts on 1st.
    if (from.getUTCDate() > 25 && day < 3) {
      // Start of new month (and maybe a new year)
      year = from.getUTCFullYear() + (from.getUTCMonth() === 11 ? 1 : 0);
      month = (from.getUTCMonth() + 1) % 12;
    } else {
      year = from.getUTCFullYear();
      month = from.getUTCMonth() + 1;
    }

    return `${year.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00Z`;
  }

  if (isGAirmetAlert(alert)) {
    const initialRelatedAlert = sortBy(
      relatedAlerts,
      "properties.validTime",
    )[0];

    return initialRelatedAlert.properties.validTime;
  }

  return alert.properties.validTimeFrom;
}

export function formatSeverity(
  severity: GAirmetFeature["properties"]["severity"],
): string | undefined {
  switch (severity) {
    case "LGT":
      return "light";
    case "MOD":
      return "moderate";
    case "SVR":
      return "severe";
  }
}
