import axios from "axios";
import Geocode from "../models/Geocode";

export async function reverse(lat: number, lon: number): Promise<Geocode> {
  const { data } = await axios.get("/api/position/reverse", {
    params: {
      format: "jsonv2",
      lat,
      lon,
    },
  });

  return {
    lat,
    lon,
    label: `${data.name || data.address.village || data.address.city}, ${
      data.address.state
    } ${data.address.postcode}`,
  };
}

export async function search(q: string): Promise<{ lat: number; lon: number }> {
  let { data } = await axios.get("/api/position/search", {
    params: {
      format: "jsonv2",
      countrycodes: "us",
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
