import axios from "axios";
import { XMLParser } from "fast-xml-parser";

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
