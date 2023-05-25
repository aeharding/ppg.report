export function isPossiblyWithinUSA(
  latitude: number,
  longitude: number
): boolean {
  // Check if latitude and longitude correspond to any specific U.S. locations or colonies
  // (Note: This is a rough approximation and may not include all locations or colonies)
  const locations = [
    {
      name: "Contiguous United States (CONUS)",
      minLatitude: 24.396308,
      maxLatitude: 49.384358,
      minLongitude: -125.0,
      maxLongitude: -66.93457,
    },
    {
      name: "Alaska",
      minLatitude: 51.214183,
      maxLatitude: 71.5388,
      minLongitude: -179.148909,
      maxLongitude: -129.974673,
    },
    {
      name: "Hawaii",
      minLatitude: 18.865461,
      maxLatitude: 28.51765,
      minLongitude: -178.334698,
      maxLongitude: -154.755792,
    },
    {
      name: "American Samoa",
      minLatitude: -14.60252,
      maxLatitude: -11.046105,
      minLongitude: -171.089874,
      maxLongitude: -168.143448,
    },
    {
      name: "Guam",
      minLatitude: 13.182335,
      maxLatitude: 13.706976,
      minLongitude: 144.563426,
      maxLongitude: 144.952492,
    },
    {
      name: "Virgin Islands",
      minLatitude: 17.623468,
      maxLatitude: 18.464984,
      minLongitude: -65.154457,
      maxLongitude: -64.512674,
    },
    {
      name: "Puerto Rico",
      minLatitude: 17.831509,
      maxLatitude: 18.570947,
      minLongitude: -67.945404,
      maxLongitude: -65.1685,
    },
    // Add more locations as needed
  ];

  for (const location of locations) {
    if (
      latitude >= location.minLatitude &&
      latitude <= location.maxLatitude &&
      longitude >= location.minLongitude &&
      longitude <= location.maxLongitude
    ) {
      return true; // Coordinates are possibly within a U.S. location or colony
    }
  }

  return false; // Coordinates are not within the United States or its locations
}

export function isWithinNWSRAPModelBoundary(
  latitude: number,
  longitude: number
): boolean {
  const isWithinBoundary =
    latitude >= 20 && latitude <= 55 && longitude >= -130 && longitude <= -60;

  return isWithinBoundary;
}
