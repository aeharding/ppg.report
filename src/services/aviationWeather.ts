import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import type { GeometryObject } from "geojson";

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

interface AbstractAviationAlertFeature<Payload = unknown> {
  id: string;
  properties: Payload;
  geometry: GeometryObject | null;
}

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

export interface SigmetOutlookFeature extends SigmetFeature {
  airSigmetType: "OUTLOOK";
}

export type ISigmetFeature = AbstractAviationAlertFeature<{
  data: "ISIGMET";

  validTimeFrom: string;
  validTimeTo: string;

  icaoId: string;

  firId: string;
  firName: string;

  hazard:
    | "TS"
    | "TURB"
    | "ICE"
    | "IFR"
    | "PCPN"
    | "VA"
    | "SS"
    | "MTW"
    | "DS"
    | "TSGR"
    | "ICE"
    | "TC";

  qualifier:
    | "ISOL"
    | "SEV"
    | "EMBD"
    | "MOD"
    | "FRQ"
    | "SQL"
    | "HVY"
    | "RDOACT CLD"
    | "OBSC";

  geom: "AREA";

  dir: "NE";

  alphaChar?: string;

  chng: "NC";

  top: number;

  rawSigmet: string;
}>;

// https://www.aviationweather.gov/dataserver/fields?datatype=gairmet
export type GAirmetFeature = AbstractAviationAlertFeature<{
  data: "GAIRMET";

  /**
   * ISO 8601 formatted date and time when G-AIRMET is issued
   */
  issueTime: string;

  /**
   * Hours forecast in the future (at time of original issuance)
   *
   * Warning: This may be stale, so don't use it.
   */
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
    | "SFC_WND"
    | "LLWS"
    | "FZLVL"
    | "M_FZLVL";

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
   * Freezing level base. Included with ice g-airmet where base === "FZL"
   */
  fzlbase?: string;

  /**
   * Freezing level top. Included with ice g-airmet where base === "FZL"
   */
  fzltop?: string;

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

export type AviationAlertFeature =
  | SigmetFeature
  | ISigmetFeature
  | GAirmetFeature
  | CwaFeature;

export async function getAviationAlerts({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<AviationAlertFeature[]> {
  const response = await axios.get("/api/aviationalerts", {
    params: {
      lat,
      lon,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.data.features.filter((feature: any) => {
    if (!feature.properties.altitudeLow1) return true;

    if (feature.properties.altitudeLow1 > 3000) return false;

    return true;
  });
}
