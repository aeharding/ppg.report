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

let locationHashArray = document.location.hash
  .replace(/#/, "")
  .split(/&/)
  .map((kv) => {
    let [k, v] = kv.split(/=/);
    return [k, decodeURI(v)] as [string, string];
  });

let locationHashMap: Map<string, string> = new Map(locationHashArray);

export function getAltitude() {
  let value = locationHashMap.get(ALTITUDE_STORAGE_KEY) as AltitudeType;
  if (
    value !== AltitudeType.AGL &&
    value !== AltitudeType.MSL &&
    value !== AltitudeType.Pressure
  )
    return undefined;
  return value;
}

export function getAltitudeLevels() {
  let value = locationHashMap.get(
    ALTITUDE_LEVELS_STORAGE_KEY,
  ) as AltitudeLevels;
  if (value !== AltitudeLevels.Default && value !== AltitudeLevels.Normalized)
    return undefined;
  return value;
}

export function getHeightUnit() {
  let value = locationHashMap.get(HEIGHT_UNIT_STORAGE_KEY) as HeightUnit;
  if (value !== HeightUnit.Feet && value !== HeightUnit.Meters)
    return undefined;
  return value;
}

export function getSpeedUnit() {
  let value = locationHashMap.get(SPEED_UNIT_STORAGE_KEY) as SpeedUnit;
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
  let value = locationHashMap.get(
    TEMPERATURE_UNIT_STORAGE_KEY,
  ) as TemperatureUnit;
  if (value !== TemperatureUnit.Celsius && value !== TemperatureUnit.Fahrenheit)
    return undefined;
  return value;
}

export function getDistanceUnit() {
  let value = locationHashMap.get(DISTANCE_UNIT_STORAGE_KEY) as DistanceUnit;
  if (value !== DistanceUnit.Kilometers && value !== DistanceUnit.Miles)
    return undefined;
  return value;
}

export function getTimeFormat() {
  let value = locationHashMap.get(TIME_FORMAT_STORAGE_KEY) as TimeFormat;
  if (value !== TimeFormat.Twelve && value !== TimeFormat.TwentyFour)
    return undefined;
  return value;
}
