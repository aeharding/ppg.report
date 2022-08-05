import axios from "axios";

/**
 * Get elevation, in meters
 *
 * https://nationalmap.gov/epqs/pqs.php?x=-111.051%20&y=45.685&units=Feet&output=json
 */
export async function getElevation({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<number> {
  let { data } = await axios.get("/api/pqs", {
    params: {
      x: lon,
      y: lat,
      units: "Meters",
      output: "json",
    },
  });

  const potentialElevation =
    data?.USGS_Elevation_Point_Query_Service?.Elevation_Query?.Elevation;

  // Failed - outside of the USA or some other reason. Use Google.
  if (typeof potentialElevation === "number" && potentialElevation !== -1000000)
    return potentialElevation;

  return await getBackupElevation({ lat, lon });
}

async function getBackupElevation({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<number> {
  let { data } = await axios.get("/api/googleelevation", {
    params: {
      locations: [lat, lon].join(","),
    },
  });

  if (data.status !== "OK")
    throw new Error("Could not fetch backup elevation for site");

  return data.results[0].elevation;
}
