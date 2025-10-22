import axios from "axios";
import type { GeometryObject } from "geojson";

export interface TAFReport {
  raw: string;
  issued: string;
  lat: number;
  lon: number;
}

// Proxy to https://www.aviationweather.gov/api/data/taf
export async function getTAF({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<TAFReport | undefined> {
  // Create a bounding box around the point (approximately 35nm radius)
  // 1 degree ≈ 60nm, so 35nm ≈ 0.58 degrees
  const buffer = 0.58;
  const bbox = `${lat - buffer},${lon - buffer},${lat + buffer},${lon + buffer}`;

  const response = await axios.get("/api/aviationweather", {
    params: {
      bbox,
      format: "json",
    },
  });

  const tafData = response.data[0];

  return {
    raw: tafData.rawTAF,
    issued: tafData.issueTime,
    lat: tafData.lat,
    lon: tafData.lon,
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
