import axios from "axios";

/**
 * Get elevation, in meters
 *
 * https://epqs.nationalmap.gov/v1/json?x=-111.051%20&y=45.685&units=Feet
 */
export async function getElevation({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<number> {
  const { data } = await axios.get("/api/pqs", {
    params: {
      x: lon,
      y: lat,
      units: "Meters",
    },
  });

  const potentialElevation = +data?.value;

  // Failed - outside of the USA or some other reason. Use Google.
  if (typeof potentialElevation === "number" && !isNaN(potentialElevation))
    return potentialElevation;

  throw new Error("Invalid elevation returned");
}

export async function getBackupElevation({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<number> {
  const { data } = await axios.get("/api/googleelevation", {
    params: {
      locations: [lat, lon].join(","),
    },
  });

  if (data.status !== "OK")
    throw new Error("Could not fetch backup elevation for site");

  return data.results[0].elevation;
}
