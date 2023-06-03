import { differenceInDays, differenceInHours } from "date-fns";
import getDistance from "geolib/es/getDistance";
import { getAlertId } from "../../helpers/alert";
import { Alert } from "../alerts/alertsSlice";
import {
  AltitudeType,
  HeightUnit,
  TemperatureUnit,
  DistanceUnit,
  TimeFormat,
  SpeedUnit,
  AltitudeLevels,
  OnOff,
} from "../../features/rap/extra/settings/settingEnums";
import {
  DEFAULT_DISTANCE_UNIT,
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_SPEED_UNIT,
  DEFAULT_TEMPERATURE_UNIT,
  DEFAULT_TIME_FORMAT,
} from "../../helpers/locale";
import { Languages } from "../../i18n";

export interface UserLocation {
  lat: number;
  lon: number;
  label: string;
  lastVisited: number;
  isFallbackLabel?: boolean;
}

const LOCATIONS_STORAGE_KEY = "user-locations";
const ALTITUDE_STORAGE_KEY = "user-altitude";
const ALTITUDE_LEVELS_STORAGE_KEY = "user-altitude-levels";
const HEIGHT_UNIT_STORAGE_KEY = "user-height-unit";
const SPEED_UNIT_STORAGE_KEY = "user-speed-unit";
const TEMPERATURE_UNIT_STORAGE_KEY = "user-temperature-unit";
const DISTANCE_UNIT_STORAGE_KEY = "user-distance-unit";
const TIME_FORMAT_STORAGE_KEY = "user-time-format";
const DISCUSSION_LAST_VIEWED_STORAGE_KEY = "discussion-last-viewed";
const READ_ALERTS = "read-alerts";
const HIDDEN_ALERTS = "hidden-alerts";
const SWIPE_INERTIA_STORAGE_KEY = "swipe-inertia";
const G_AIRMET_READ_STORAGE_KEY = "g-airmet-read";
const LANGUAGE_STORAGE_KEY = "user-language";
const LAPSE_RATE_STORAGE_KEY = "lapse-rate";
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
    (savedValue !== AltitudeType.AGL &&
      savedValue !== AltitudeType.MSL &&
      savedValue !== AltitudeType.Pressure)
  )
    return AltitudeType.AGL;

  return savedValue;
}

export function setAltitudeLevels(altitudeLevels: AltitudeLevels): void {
  localStorage.setItem(ALTITUDE_LEVELS_STORAGE_KEY, altitudeLevels);
}

export function getAltitudeLevels(): AltitudeLevels {
  const savedValue = localStorage.getItem(ALTITUDE_LEVELS_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== AltitudeLevels.Default &&
      savedValue !== AltitudeLevels.Normalized)
  )
    return AltitudeLevels.Default;

  return savedValue;
}

export function setAltitude(altitude: AltitudeType): void {
  localStorage.setItem(ALTITUDE_STORAGE_KEY, altitude);
}

export function getHeightUnit(): HeightUnit {
  const savedValue = localStorage.getItem(HEIGHT_UNIT_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== HeightUnit.Feet && savedValue !== HeightUnit.Meters)
  )
    return DEFAULT_HEIGHT_UNIT;

  return savedValue;
}

export function setHeightUnit(heightUnit: HeightUnit): void {
  localStorage.setItem(HEIGHT_UNIT_STORAGE_KEY, heightUnit);
}

export function getSpeedUnit(): SpeedUnit {
  const savedValue = localStorage.getItem(SPEED_UNIT_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== SpeedUnit.KPH &&
      savedValue !== SpeedUnit.Knots &&
      savedValue !== SpeedUnit.MPH)
  )
    return DEFAULT_SPEED_UNIT;

  return savedValue;
}

export function setSpeedUnit(speedUnit: SpeedUnit): void {
  localStorage.setItem(SPEED_UNIT_STORAGE_KEY, speedUnit);
}

export function getTemperatureUnit(): TemperatureUnit {
  const savedValue = localStorage.getItem(TEMPERATURE_UNIT_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== TemperatureUnit.Celsius &&
      savedValue !== TemperatureUnit.Fahrenheit)
  )
    return DEFAULT_TEMPERATURE_UNIT;

  return savedValue;
}

export function setTemperatureUnit(temperatureUnit: TemperatureUnit): void {
  localStorage.setItem(TEMPERATURE_UNIT_STORAGE_KEY, temperatureUnit);
}

export function getDistanceUnit(): DistanceUnit {
  const savedValue = localStorage.getItem(DISTANCE_UNIT_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== DistanceUnit.Kilometers &&
      savedValue !== DistanceUnit.Miles)
  )
    return DEFAULT_DISTANCE_UNIT;

  return savedValue;
}

export function setDistanceUnit(distanceUnit: DistanceUnit): void {
  localStorage.setItem(DISTANCE_UNIT_STORAGE_KEY, distanceUnit);
}

export function getTimeFormat(): TimeFormat {
  const savedValue = localStorage.getItem(TIME_FORMAT_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== TimeFormat.Twelve && savedValue !== TimeFormat.TwentyFour)
  )
    return DEFAULT_TIME_FORMAT;

  return savedValue;
}

export function setTimeFormat(timeFormat: TimeFormat): void {
  localStorage.setItem(TIME_FORMAT_STORAGE_KEY, timeFormat);
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

export function setReadAlert(alert: Alert): Record<string, string> {
  const readAlerts = getReadAlerts();

  readAlerts[getAlertId(alert)] = new Date().toISOString();

  // Cleanup old entries
  Object.entries(readAlerts).forEach(([key, dateString]) => {
    if (differenceInDays(new Date(), new Date(dateString)) > 30) {
      delete readAlerts[key];
    }
  });

  localStorage.setItem(READ_ALERTS, JSON.stringify(readAlerts));

  return readAlerts;
}

export function getHiddenAlerts(): Record<string, true> {
  const savedValue = localStorage.getItem(HIDDEN_ALERTS);

  if (typeof savedValue !== "string") return {};

  return JSON.parse(savedValue);
}

export function setHiddenAlert(alert: Alert): Record<string, true> {
  const hiddenAlerts = getHiddenAlerts();

  hiddenAlerts[getAlertId(alert)] = true;

  localStorage.setItem(HIDDEN_ALERTS, JSON.stringify(hiddenAlerts));

  return hiddenAlerts;
}

export function resetHiddenAlerts() {
  localStorage.removeItem(HIDDEN_ALERTS);
}

export function getSwipeInertia(): OnOff {
  const savedValue = localStorage.getItem(SWIPE_INERTIA_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== OnOff.On && savedValue !== OnOff.Off)
  )
    return OnOff.On;

  return savedValue;
}

export function setSwipeInertia(swipeInertia: OnOff): OnOff {
  localStorage.setItem(SWIPE_INERTIA_STORAGE_KEY, swipeInertia);

  return swipeInertia;
}

export function getGAirmetRead(): OnOff {
  const savedValue = localStorage.getItem(G_AIRMET_READ_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== OnOff.On && savedValue !== OnOff.Off)
  )
    return OnOff.Off;

  return savedValue;
}

export function setGAirmetRead(gAirmetRead: OnOff): OnOff {
  localStorage.setItem(G_AIRMET_READ_STORAGE_KEY, gAirmetRead);

  return gAirmetRead;
}

export function getLanguage(): Languages {
  const savedValue = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (
    savedValue !== Languages.Auto &&
    savedValue !== Languages.EN &&
    savedValue !== Languages.FR &&
    savedValue !== Languages.NL &&
    savedValue !== Languages.ES &&
    savedValue !== Languages.DE
  )
    return Languages.EN;

  return savedValue;
}

export function setLanguage(language: Languages): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getLapseRate(): OnOff {
  const savedValue = localStorage.getItem(LAPSE_RATE_STORAGE_KEY);

  if (
    typeof savedValue !== "string" ||
    (savedValue !== OnOff.Off && savedValue !== OnOff.On)
  )
    return OnOff.Off;

  return savedValue;
}

export function setLapseRate(lapseRate: OnOff): void {
  localStorage.setItem(LAPSE_RATE_STORAGE_KEY, lapseRate);
}
