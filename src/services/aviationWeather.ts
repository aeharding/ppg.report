import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { GeometryObject } from "geojson";
import { isGAirmetAlert, isSigmetAlert } from "../features/alerts/alertsSlice";
import { notEmpty } from "../helpers/array";
import { capitalizeFirstLetter } from "../helpers/string";

const parser = new XMLParser();

export interface TAFReport {
  raw: string;
  issued: string;
  lat: number;
  lon: number;
}

// Proxy to https://www.aviationweather.gov/adds/dataserver_current/httpparam
export async function getTAF({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<TAFReport | undefined> {
  const response = await axios.get("/api/aviationweather", {
    params: {
      dataSource: "tafs",
      requestType: "retrieve",
      format: "xml",
      radialDistance: `35;${lon},${lat}`,
      hoursBeforeNow: 3,
      mostRecent: true,
      fields: ["raw_text", "issue_time", "latitude", "longitude"].join(","),
    },
  });
  const parsed = parser.parse(response.data);

  if (!parsed.response.data?.TAF) return;

  return {
    raw: parsed.response.data.TAF.raw_text,
    issued: parsed.response.data.TAF.issue_time,
    lat: +parsed.response.data.TAF.latitude,
    lon: +parsed.response.data.TAF.longitude,
  };
}

// Docs https://www.aviationweather.gov/help/webservice

type AbstractAviationAlertFeature<Payload = {}> = {
  id: string;
  properties: Payload;
  geometry: GeometryObject | null;
};

export type SigmetFeature = AbstractAviationAlertFeature<{
  data: "SIGMET";

  validTimeFrom: string;
  validTimeTo: string;

  icaoId: string;
  airSigmetType: "SIGMET" | "OUTLOOK";
  hazard: "CONVECTIVE" | "TURB" | "ICING" | "IFR" | "MTN OBSCN" | "ASH";

  alphaChar?: string;

  /**
   * typically 1 or 2, 0 for outlook
   */
  severity: 0 | 1 | 2;

  /**
   * Lowest level SIGMET is valid in feet
   */
  altitudeLow1: number;

  /**
   * Secondary lowest level SIGMET is valid in feet
   */
  altitudeLow2: number;

  /**
   * Highest level SIGMET is valid in feet
   */
  altitudeHi1: number;

  /**
   * Secondary highest level SIGMET is valid in feet
   */
  altitudeHi2: number;

  rawAirSigmet: string;
}>;

// https://www.aviationweather.gov/dataserver/fields?datatype=gairmet
export type GAirmetFeature = AbstractAviationAlertFeature<{
  data: "GAIRMET";

  /**
   * ISO 8601 formatted date and time when G-AIRMET is issued
   */
  issueTime: string;

  forecast: string;

  /**
   * ISO 8601 formatted date and time when G-AIRMET is valid
   */
  validTime: string;

  product: "SIERRA" | "TANGO" | "ZULU";

  hazard:
    | "TURB-HI"
    | "TURB-LO"
    | "ICE"
    | "IFR"
    | "MT_OBSC"
    | "SFC_WIND"
    | "LLWS"
    | "FZLVL";

  severity?: "LGT" | "MOD" | "SVR";

  /**
   * Lowest level G-AIRMET is valid in 100s feet
   */
  base?: string;

  /**
   * Highest level G-AIRMET is valid in 100s feet
   */
  top?: string;

  /**
   * Additional information for advisory
   */
  dueTo?: string;
}>;

export type CwaFeature = AbstractAviationAlertFeature<{
  data: "CWA";

  validTimeFrom: string;
  validTimeTo: string;

  /**
   * ARTCC region identifier
   */
  cwsu: string;

  /**
   * Long name for the region
   */
  name: string;

  /**
   * Long name for the region
   */
  seriesId: string;

  cwaText: string;
  base: number;
  top: number;
  qualifier: "ISOL" | "SEV" | "EMBD" | "MOD"; // etc?
  hazard: "TS" | "TURB" | "ICE" | "IFR" | "PCPN";
}>;

export type AviationAlertFeature = SigmetFeature | GAirmetFeature | CwaFeature;

export async function getAviationAlerts({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const response = await axios.get("/api/aviationalerts", {
    params: {
      lat,
      lon,
    },
  });

  return response.data.features.filter((feature: any) => {
    if (!feature.properties.altitudeLow1) return true;

    if (feature.properties.altitudeLow1 > 3000) return false;

    return true;
  });
}

export function getAviationAlertName(alert: AviationAlertFeature): string {
  if (isSigmetAlert(alert)) {
    return getSigmetAlertName(alert);
  }

  if (isGAirmetAlert(alert)) {
    return getGAirmetAlertName(alert);
  }

  return getCwaAlertName(alert);
}

function getSigmetAlertName(alert: SigmetFeature): string {
  return [formatHazard(alert.properties.hazard), getSigmetAlertType(alert)]
    .filter((a) => a)
    .join(" ");
}

function getSigmetAlertType(alert: SigmetFeature): string {
  if (alert.properties.airSigmetType === "OUTLOOK") {
    return "SIGMET Outlook";
  }

  return alert.properties.airSigmetType;
}

function getGAirmetAlertName(alert: GAirmetFeature): string {
  return [
    formatSeverity(alert.properties.severity),
    formatHazard(alert.properties.hazard),
    "G-AIRMET",
  ]
    .filter(notEmpty)
    .map(capitalizeFirstLetter)
    .join(" ");
}

function getCwaAlertName(alert: CwaFeature): string {
  return `${alert.properties.cwsu} ${alert.properties.data}: ${[
    formatQualifier(alert.properties.qualifier),
    formatHazard(alert.properties.hazard),
  ].join(" ")}`;
}

function formatHazard(
  hazard: AviationAlertFeature["properties"]["hazard"]
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
    case "SFC_WIND":
      return "Surface Wind";
    case "FZLVL":
      return "Freezing Level";
  }
}

function formatQualifier(
  qualifier: CwaFeature["properties"]["qualifier"]
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
  }
}

export function extractIssued(alert: AviationAlertFeature): string {
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
    return alert.properties.issueTime;
  }

  return alert.properties.validTimeFrom;
}

export function formatSeverity(
  severity: GAirmetFeature["properties"]["severity"]
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
