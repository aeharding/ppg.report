import styled from "@emotion/styled";
import chroma from "chroma-js";
import {
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "../../../helpers/colors";
import { Aside } from "./Altitude";
import { useAppSelector } from "../../../hooks";
import { cToF } from "../../weather/aviation/DetailedAviationReport";
import { TemperatureUnit } from "../extra/settings/settingEnums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faDewpoint,
} from "@fortawesome/pro-light-svg-icons";
import { keyframes } from "@emotion/react";

const DropletIcon = styled(FontAwesomeIcon)<{ opacity: number }>`
  font-size: 0.8em;
  color: #0091ff;

  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);

  opacity: ${({ opacity }) => opacity};
  filter: ${({ opacity }) => (opacity >= 1 ? "blur(0)" : "blur(1px)")};
`;

const risingAirAnimation = keyframes`
  0% {
    transform: translateY(-150%);
  }

  2% {
    transform: translateY(calc(-150% + 3px));
  }

  4% {
    transform: translateY(-150%);
  }

  100% {
    transform: translateY(-150%);
  }
`;

const lapseColorScale = chroma
  .scale([
    "rgb(255, 0, 0)",
    "rgba(255, 0, 0, 0.5)",
    "#00000000",
    "#00000000",
    "#15ff00",
  ])
  .domain([-0.022, -0.01951, -0.195, 0, 0.01]);

const LapseDangerIcon = styled(FontAwesomeIcon)<{
  index: number;
  lapseRate: number;
}>`
  position: absolute;
  right: -8px;
  top: 50%;
  font-size: 0.8em;
  transform: translateY(-150%);

  ${() => outputP3ColorFromRGB([255, 0, 0])}

  ${({ lapseRate }) =>
    outputP3ColorFromRGBA(lapseColorScale(lapseRate).rgba())} /* opacity: ${({
    opacity,
  }) => opacity}; */

  /* animation: ${() => risingAirAnimation};
  animation-iteration-count: infinite;
  animation-duration: 6s;
  animation-delay: ${({ index }) => index * 30 + 6_000}ms; */
`;

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#00ff00", "yellow", "red"])
  .domain([-5, 32, 60, 86, 95]);

const TemperatureContainer = styled.div<{ temperatureInFarenheit: number }>`
  position: relative;

  ${({ temperatureInFarenheit: temperature }) =>
    outputP3ColorFromRGB(colorScale(temperature).rgb())}
`;

interface TemperatureProps {
  temperature: number; // Celsius
  dewpoint?: number;
  lapseRate?: number; // ℃/m
  pressure?: number;
  rowNumber: number;
}

const DRY_LAPSE_RATE = 0.0100185; // C/m

export default function Temperature({
  temperature: inCelsius,
  dewpoint,
  lapseRate,
  pressure,
  rowNumber,
}: TemperatureProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const temperature = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return inCelsius;
      case TemperatureUnit.Fahrenheit:
        return cToF(inCelsius);
    }
  })();

  const temperatureUnitLabel = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "C";
      case TemperatureUnit.Fahrenheit:
        return "F";
    }
  })();

  const saturated = dewpoint != null ? inCelsius - dewpoint < 0 : false;
  const lapseRateThreshold = saturated
    ? dewpoint != null &&
      pressure != null &&
      calculateSaturatedAdiabaticLapseRate(dewpoint, inCelsius, pressure)
    : DRY_LAPSE_RATE;

  return (
    <TemperatureContainer temperatureInFarenheit={cToF(inCelsius)}>
      {Math.round(temperature)} <Aside>°{temperatureUnitLabel}</Aside>{" "}
      {dewpoint != null && inCelsius - dewpoint <= 2.5 && inCelsius > 0 ? (
        <DropletIcon
          icon={faDewpoint}
          opacity={1 - scaleValue(inCelsius - dewpoint, 0, 1.5)}
        />
      ) : (
        ""
      )}
      {lapseRate != null && lapseRateThreshold ? (
        <LapseDangerIcon
          icon={lapseRate - lapseRateThreshold < 0 ? faArrowUp : faArrowDown}
          lapseRate={lapseRate - lapseRateThreshold}
          index={rowNumber}
        />
      ) : (
        ""
      )}
    </TemperatureContainer>
  );
}

function scaleValue(value: number, min: number, max: number): number {
  if (value <= min) {
    return 0;
  } else if (value >= max) {
    return 1;
  } else {
    return (value - min) / (max - min);
  }
}

function calculateSaturatedAdiabaticLapseRate(
  dewPoint: number,
  temperature: number,
  pressure: number
): number {
  const g = 9.8; // Acceleration due to gravity (m/s²)
  const Cp = 1005; // Specific heat of air at constant pressure (J/kg·K)
  const Lv = 2.5e6; // Latent heat of vaporization for water (J/kg)
  const Rd = 287; // Specific gas constant for dry air (J/kg·K)

  // Convert temperature from Celsius to Kelvin
  const T = temperature + 273.15;

  // Calculate vapor pressure at the dew point temperature
  const e = calculateVaporPressure(dewPoint);

  // Calculate mixing ratio
  const r = calculateMixingRatio(e, pressure);

  // Calculate the saturated-adiabatic lapse rate
  const gammaSat = (g / Cp) * (1 - (Lv * r) / (Rd * T));

  return gammaSat;
}

function calculateVaporPressure(temperature: number): number {
  const temperatureCelsius = temperature;

  // Calculate saturation vapor pressure using the Magnus formula
  const vaporPressure =
    6.112 *
    Math.exp((17.67 * temperatureCelsius) / (temperatureCelsius + 243.5));

  return vaporPressure;
}

function calculateMixingRatio(vaporPressure: number, pressure: number): number {
  // Calculate mixing ratio using vapor pressure and total pressure
  const mixingRatio = (0.622 * vaporPressure) / (pressure - vaporPressure);

  return mixingRatio;
}
