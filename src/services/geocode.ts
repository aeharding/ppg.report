import axios from "axios";
import Geocode from "../models/Geocode";

export async function reverse(lat: number, lon: number): Promise<Geocode> {
  // TODO type response (it's weird)
  let data: any;

  try {
    data = (
      await axios.get("/api/position/reverse", {
        params: {
          format: "jsonv2",
          lat,
          lon,
        },
      })
    ).data;
  } catch (e) {
    data = {};
  }

  // Coordinates in ocean? API down?
  if (!data.address || !data)
    return { lat, lon, label: `${lat}, ${lon}`, isFallbackLabel: true };

  const subject =
    data.address.aeroway ??
    data.address.town ??
    data.address.village ??
    data.address.borough ??
    data.address.city ??
    data.address.hamlet ??
    data.address.municipality ??
    data.address.county;

  const label = [
    subject ? `${subject},` : "",
    data.address.state ??
      data.address.province ??
      data.address.county ??
      data.address.city,
    data.address.postcode,
  ].filter((x) => x);

  if (label.length === 0) label.push(data.address.country);

  return {
    lat,
    lon,
    label: label.join(" "),
  };
}

export async function search(q: string): Promise<{ lat: number; lon: number }> {
  let { data } = await axios.get("/api/position/search", {
    params: {
      format: "jsonv2",
      limit: 1,
      q,
    },
  });

  if (!data[0]) throw new Error("No data found matching query");

  return {
    lat: +data[0].lat,
    lon: +data[0].lon,
  };
}
