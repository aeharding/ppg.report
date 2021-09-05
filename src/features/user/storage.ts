import getDistance from "geolib/es/getDistance";

export interface UserLocation {
  lat: number;
  lon: number;
  label: string;
  lastVisited: number;
}

const LOCATIONS_STORAGE_KEY = "user-locations";
const MAX_LOCATIONS = 5;
const MAX_DISTANCE_MATCH = 100; // meters

export function getLocations(): UserLocation[] {
  const locations: UserLocation[] = JSON.parse(
    localStorage.getItem(LOCATIONS_STORAGE_KEY) || "[]"
  );

  return locations;
}

export function visitedLocation(location: UserLocation): UserLocation[] {
  const locations = getLocations();

  locations.sort((a, b) => getDistance(a, location) - getDistance(b, location));

  if (
    !locations.length ||
    getDistance(locations[0], location) > MAX_DISTANCE_MATCH
  ) {
    locations.push(location);
  } else {
    locations[0] = location;
  }

  const recentLocations = locations
    .sort((a, b) => b.lastVisited - a.lastVisited)
    .slice(0, MAX_LOCATIONS);

  localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(recentLocations));

  return recentLocations;
}

export function removeLocation(location: UserLocation): UserLocation[] {
  const locations = getLocations();

  const index = locations.findIndex(
    ({ lat, lon }) => location.lat === lat && location.lon === lon
  );

  if (index === -1) return locations;

  locations.splice(index, 1);

  localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));

  return locations;
}
