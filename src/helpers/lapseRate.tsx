import { deltaCToDeltaF } from "../features/rap/cells/tooltips/temperature/Spread";
import {
  HeightUnit,
  TemperatureUnit,
} from "../features/rap/extra/settings/settingEnums";

/**
 * Human readable lapse rate
 * @param lapseRate degC·m-1
 * @param temperatureUnit
 * @param heightUnit
 */
export function renderLapseRate(
  lapseRate: number,
  temperatureUnit: TemperatureUnit,
  heightUnit: HeightUnit
): string {
  return `${renderLapseRateValue(
    lapseRate,
    temperatureUnit,
    heightUnit
  )} ${renderLapseRateUnit(temperatureUnit, heightUnit)}`;
}

function renderLapseRateValue(
  lapseRate: number,
  temperatureUnit: TemperatureUnit,
  heightUnit: HeightUnit
) {
  const heightUnitFactor = (() => {
    switch (heightUnit) {
      case HeightUnit.Feet:
        return 0.3048 * 1_000;
      case HeightUnit.Meters:
        return 1_000;
    }
  })();

  const convertedLapseRate = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return lapseRate * heightUnitFactor;
      case TemperatureUnit.Fahrenheit:
        return deltaCToDeltaF(lapseRate) * heightUnitFactor;
    }
  })();

  return (Math.round(convertedLapseRate * 10) / 10).toFixed(1);
}

function renderLapseRateUnit(
  temperatureUnit: TemperatureUnit,
  heightUnit: HeightUnit
) {
  const temp = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "°C";
      case TemperatureUnit.Fahrenheit:
        return "°F";
    }
  })();

  const height = (() => {
    switch (heightUnit) {
      case HeightUnit.Feet:
        return "1,000 ft";
      case HeightUnit.Meters:
        return "km";
    }
  })();

  return `${temp} / ${height}`;
}
