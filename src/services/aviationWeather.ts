import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { GeometryObject } from "geojson";
import { isAirSigmetAlert } from "../features/alerts/alertsSlice";

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
  properties: {
    validTimeFrom: string;
    validTimeTo: string;
  } & Payload;
  geometry: GeometryObject | null;
};

export type AirSigmetFeature = AbstractAviationAlertFeature<
  | {
      data: "SIGMET";

      icaoId: string;
      airSigmetType: "SIGMET" | "OUTLOOK";
      hazard: "CONVECTIVE" | "TURB" | "ICING" | "IFR" | "MTN OBSCN" | "ASH";

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
    }
  | {
      data: "AIRMET";

      icaoId: string;
      airSigmetType: "AIRMET";
      hazard: "TURB" | "ICING" | "IFR" | "MTN OBSCN";
      severity: 1 | 2 | 3 | 4;

      /**
       * Lowest level AIRMET is valid in feet
       */
      altitudeLow1: number;

      /**
       * Secondary lowest level AIRMET is valid in feet
       */
      altitudeLow2: number;

      /**
       * Highest level AIRMET is valid in feet
       */
      altitudeHi1: number;

      /**
       * Secondary highest level AIRMET is valid in feet
       */
      altitudeHi2: number;

      rawAirSigmet: string;
    }
>;

export type CwaFeature = AbstractAviationAlertFeature<{
  data: "CWA";

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

export type AviationAlertFeature = AirSigmetFeature | CwaFeature;

export async function getAirSigmets({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const response = await axios.get("/api/query-wx", {
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
  if (isAirSigmetAlert(alert)) {
    return getAirSigmetAlertName(alert);
  }

  return getCwaAlertName(alert);
}

function getAirSigmetAlertName(alert: AirSigmetFeature): string {
  return [formatHazard(alert.properties.hazard), getAirSigmetAlertType(alert)]
    .filter((a) => a)
    .join(" ");
}

function getAirSigmetAlertType(alert: AirSigmetFeature): string {
  if (alert.properties.airSigmetType === "OUTLOOK") {
    return "SIGMET Outlook";
  }

  return alert.properties.airSigmetType;
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
      return "Mountain Obstruction";
    case "TURB":
      return "Turbulence";
    case "PCPN":
      return "Precipitation";
    case "TS":
      return "Thunderstorms";
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
