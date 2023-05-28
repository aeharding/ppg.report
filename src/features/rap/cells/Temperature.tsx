import styled from "@emotion/styled";
import chroma from "chroma-js";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { Aside } from "./Altitude";
import { useAppSelector } from "../../../hooks";
import { cToF } from "../../weather/aviation/DetailedAviationReport";
import { TemperatureUnit } from "../extra/settings/settingEnums";

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#00ff00", "yellow", "red"])
  .domain([-5, 32, 60, 86, 95]);

const TemperatureContainer = styled.div<{ temperatureInFarenheit: number }>`
  ${({ temperatureInFarenheit: temperature }) =>
    outputP3ColorFromRGB(colorScale(temperature).rgb())}
`;

interface TemperatureProps {
  temperature: number; // Celsius
}

export default function Temperature({
  temperature: inCelsius,
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

  return (
    <TemperatureContainer temperatureInFarenheit={cToF(inCelsius)}>
      {Math.round(temperature)} <Aside>°{temperatureUnitLabel}</Aside>
    </TemperatureContainer>
  );
}
