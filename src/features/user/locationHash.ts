import {
  ALTITUDE_STORAGE_KEY,
  ALTITUDE_LEVELS_STORAGE_KEY,
  HEIGHT_UNIT_STORAGE_KEY,
  SPEED_UNIT_STORAGE_KEY,
  TEMPERATURE_UNIT_STORAGE_KEY,
  DISTANCE_UNIT_STORAGE_KEY,
  TIME_FORMAT_STORAGE_KEY,
} from "./constants";

import {
  AltitudeType,
  AltitudeLevels,
  HeightUnit,
  SpeedUnit,
  TemperatureUnit,
  DistanceUnit,
  TimeFormat,
} from "../rap/extra/settings/settingEnums";

const locationHashArray = document.location.hash
  .replace(/#/, "")
  .split(/&/)
  .map((kv) => {
    const [k, v] = kv.split(/=/);
    return [k, decodeURI(v)] as const;
  });

const locationHashMap: Map<string, string> = new Map(locationHashArray);

export function getAltitude() {
  const value = locationHashMap.get(ALTITUDE_STORAGE_KEY) as AltitudeType;
  if (
    value !== AltitudeType.AGL &&
    value !== AltitudeType.MSL &&
    value !== AltitudeType.Pressure
  )
    return undefined;
  return value;
}

export function getAltitudeLevels() {
  const value = locationHashMap.get(
    ALTITUDE_LEVELS_STORAGE_KEY,
  ) as AltitudeLevels;
  if (value !== AltitudeLevels.Default && value !== AltitudeLevels.Normalized)
    return undefined;
  return value;
}

export function getHeightUnit() {
  const value = locationHashMap.get(HEIGHT_UNIT_STORAGE_KEY) as HeightUnit;
  if (value !== HeightUnit.Feet && value !== HeightUnit.Meters)
    return undefined;
  return value;
}

export function getSpeedUnit() {
  const value = locationHashMap.get(SPEED_UNIT_STORAGE_KEY) as SpeedUnit;
  if (
    value !== SpeedUnit.KPH &&
    value !== SpeedUnit.Knots &&
    value !== SpeedUnit.MPH &&
    value !== SpeedUnit.mps
  )
    return undefined;
  return value;
}

export function getTemperatureUnit() {
  const value = locationHashMap.get(
    TEMPERATURE_UNIT_STORAGE_KEY,
  ) as TemperatureUnit;
  if (value !== TemperatureUnit.Celsius && value !== TemperatureUnit.Fahrenheit)
    return undefined;
  return value;
}

export function getDistanceUnit() {
  const value = locationHashMap.get(DISTANCE_UNIT_STORAGE_KEY) as DistanceUnit;
  if (value !== DistanceUnit.Kilometers && value !== DistanceUnit.Miles)
    return undefined;
  return value;
}

export function getTimeFormat() {
  const value = locationHashMap.get(TIME_FORMAT_STORAGE_KEY) as TimeFormat;
  if (value !== TimeFormat.Twelve && value !== TimeFormat.TwentyFour)
    return undefined;
  return value;
}
