import axios from "axios";

export async function get({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<string> {
  const res = await axios.get("/api/timezone", {
    params: {
      format: "json",
      by: "position",
      lat,
      lng: lon,
    },
  });

  return res.data.zoneName;
}
