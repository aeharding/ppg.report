import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { GeometryObject } from "geojson";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

const parser = new XMLParser();
const parserWithAttributes = new XMLParser({ ignoreAttributes: false });

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

export type AirSigmetType = "OUTLOOK" | "AIRMET" | "SIGMET";
export type HazardType =
  | "MTN OBSCN"
  | "IFR"
  | "TURB"
  | "ICE"
  | "CONVECTIVE"
  | "ASH";
export type HazardSeverity = "NONE" | "LT-MOD" | "MOD" | "MOD-SEV" | "SEV";

export interface AirSigmetFeature {
  properties: {
    type: AirSigmetType;
    from: string;
    to: string;
    text: string;
    hazardType?: HazardType;
    hazardSeverity?: HazardSeverity;
  };
  geometry: GeometryObject | null;
}

export async function getAirSigmets({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const response = await axios.get("/api/aviationweather", {
    params: {
      dataSource: "airsigmets",
      requestType: "retrieve",
      format: "xml",
      minLat: Math.round((lat - 0.01) * 1000) / 1000,
      minLon: Math.round((lon - 0.01) * 1000) / 1000,
      maxLat: Math.round((lat + 0.01) * 1000) / 1000,
      maxLon: Math.round((lon + 0.01) * 1000) / 1000,
      startTime: Math.round(Date.now() / 1000),
      endTime: Math.round(Date.now() / 1000) + 60 * 60 * 10,
    },
  });

  const parsed = parserWithAttributes.parse(response.data);

  const airsigmets = Array.isArray(parsed.response.data.AIRSIGMET)
    ? parsed.response.data.AIRSIGMET
    : [parsed.response.data.AIRSIGMET];

  const results: AirSigmetFeature[] = airsigmets
    .filter((airsigmet: any) => {
      if (!airsigmet) return undefined;

      if (typeof airsigmet.altitude === "object") {
        if (!airsigmet.altitude["@_min_ft_msl"]) return true;
        if (+airsigmet.altitude["@_min_ft_msl"] <= 2000) return true;

        return false;
      }

      return true;
    })
    .map(
      (airsigmet: any): AirSigmetFeature => ({
        properties: {
          type: airsigmet.airsigmet_type,
          from: airsigmet.valid_time_from,
          to: airsigmet.valid_time_to,
          text: airsigmet.raw_text,
          hazardType: airsigmet.hazard["@_type"],
          hazardSeverity: airsigmet.hazard["@_severity"],
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            airsigmet.area.point.map((point: any) => [
              point.longitude,
              point.latitude,
            ]),
          ],
        },
      })
    );

  return uniqWith(results, (a, b) => isEqual(a.geometry, b.geometry));
}

export function getAirSigmetName(alert: AirSigmetFeature): string {
  const hazard = formatHazard(alert);

  if (hazard) {
    return capitalizeFirstLetter(
      `${hazard} ${formatType(alert.properties.type)}`
    );
  }

  return capitalizeFirstLetter(formatType(alert.properties.type));
}

export function formatType(type: AirSigmetType): string {
  switch (type) {
    case "AIRMET":
      return "AIRMET";
    case "SIGMET":
      return "Active SIGMET";
    case "OUTLOOK":
      return "SIGMET Outlook";
  }
}

export function formatHazard(alert: AirSigmetFeature): string | undefined {
  const words = [
    alert.properties.hazardSeverity &&
    alert.properties.hazardSeverity !== "NONE"
      ? formatSeverity(alert.properties.hazardSeverity)
      : "",
    alert.properties.hazardType &&
      formatHazardType(alert.properties.hazardType),
  ].filter((word) => word);

  if (!words.length) return undefined;

  return words.join(" ");
}

export function formatSeverity(severity: HazardSeverity): string {
  switch (severity) {
    case "LT-MOD":
      return "light-moderate";
    case "MOD":
      return "moderate";
    case "MOD-SEV":
      return "moderate-severe";
    case "NONE":
      return "none";
    case "SEV":
      return "severe";
  }
}
export function formatHazardType(type: HazardType): string {
  switch (type) {
    case "ASH":
      return "ash";
    case "CONVECTIVE":
      return "convective";
    case "ICE":
      return "ice";
    case "IFR":
      return "IFR";
    case "MTN OBSCN":
      return "mountain obstruction";
    case "TURB":
      return "turbulence";
  }
}

function capitalizeFirstLetter(words: string) {
  return words.charAt(0).toUpperCase() + words.slice(1);
}
