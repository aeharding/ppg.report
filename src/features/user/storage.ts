import { differenceInDays, differenceInHours } from "date-fns";
import getDistance from "geolib/es/getDistance";
import { TFRFeature } from "../../services/faa";
import { isWeatherAlert } from "../alerts/alertsSlice";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { AltitudeType } from "./userSlice";

export interface UserLocation {
  lat: number;
  lon: number;
  label: string;
  lastVisited: number;
  isFallbackLabel?: boolean;
}

const LOCATIONS_STORAGE_KEY = "user-locations";
const ALTITUDE_STORAGE_KEY = "user-altitude";
const DISCUSSION_LAST_VIEWED_STORAGE_KEY = "discussion-last-viewed";
const READ_ALERTS = "read-alerts";
const MAX_LOCATIONS = 5;
const MAX_DISTANCE_MATCH = 1000; // meters

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
    locations[0] = {
      ...location,

      // If the API failed, don't update stored location with fallback label
      label: location.isFallbackLabel
        ? locations[0].label || location.label
        : location.label,
    };
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

export function findLocation(
  coords: GeolocationCoordinates
): UserLocation | undefined {
  const locations = getLocations();

  locations.sort((a, b) => getDistance(a, coords) - getDistance(b, coords));

  if (
    locations.length &&
    getDistance(locations[0], coords) <= MAX_DISTANCE_MATCH
  ) {
    return locations[0];
  }
}

export function getAltitude(): AltitudeType {
  const savedValue = localStorage.getItem(ALTITUDE_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== AltitudeType.AGL && savedValue !== AltitudeType.MSL)
  )
    return AltitudeType.AGL;

  return AltitudeType[savedValue];
}

export function setAltitude(altitude: AltitudeType): void {
  localStorage.setItem(ALTITUDE_STORAGE_KEY, altitude);
}

export function discussionLastViewedByStation(): Record<string, string> {
  const savedValue = localStorage.getItem(DISCUSSION_LAST_VIEWED_STORAGE_KEY);

  if (typeof savedValue !== "string") return {};

  return JSON.parse(savedValue);
}

export function setDiscussionViewed(stationId: string, date: string) {
  const discussionsLastViewed = discussionLastViewedByStation();

  Object.keys(discussionsLastViewed).forEach((stationId) => {
    if (
      differenceInHours(
        new Date(discussionsLastViewed[stationId]),
        new Date()
      ) > 24
    )
      delete discussionsLastViewed[stationId];
  });

  discussionsLastViewed[stationId] = date;

  localStorage.setItem(
    DISCUSSION_LAST_VIEWED_STORAGE_KEY,
    JSON.stringify(discussionsLastViewed)
  );
}

export function getReadAlerts(): Record<string, string> {
  const savedValue = localStorage.getItem(READ_ALERTS);

  if (typeof savedValue !== "string") return {};

  return JSON.parse(savedValue);
}

export function setReadAlert(
  alert: TFRFeature | WeatherAlertFeature
): Record<string, string> {
  const readAlerts = getReadAlerts();

  readAlerts[getReadAlertKey(alert)] = new Date().toISOString();

  // Cleanup old entries
  Object.entries(readAlerts).forEach(([key, dateString]) => {
    if (differenceInDays(new Date(dateString), new Date()) > 30) {
      delete readAlerts[key];
    }
  });

  localStorage.setItem(READ_ALERTS, JSON.stringify(readAlerts));

  return readAlerts;
}

export function getReadAlertKey(
  alert: TFRFeature | WeatherAlertFeature
): string {
  return isWeatherAlert(alert)
    ? alert.properties.id
    : alert.properties.coreNOTAMData.notam.id;
}
