import styled from "@emotion/styled";
import chroma from "chroma-js";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { Aside } from "./Altitude";
import { useAppSelector } from "../../../hooks";
import { TemperatureUnit } from "../../user/userSlice";

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#00ff00", "yellow", "red"])
  .domain([-5, 32, 60, 86, 95]);

const TemperatureContainer = styled.div<{ temperatureInFarenheit: number }>`
  ${({ temperatureInFarenheit: temperature }) =>
    outputP3ColorFromRGB(colorScale(temperature).rgb())}
`;

interface TemperatureProps {
  temperature: number; // tenths of a degree Celsius
}

export default function Temperature({
  temperature: tenthsDegC,
}: TemperatureProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const inFahrenheit = getFahrenheitFromCelsius(tenthsDegC / 10);

  const temperature = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return tenthsDegC / 10;
      case TemperatureUnit.Fahrenheit:
        return inFahrenheit;
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
    <TemperatureContainer temperatureInFarenheit={inFahrenheit}>
      {Math.round(temperature)} <Aside>°{temperatureUnitLabel}</Aside>
    </TemperatureContainer>
  );
}

function getFahrenheitFromCelsius(celsius: number): number {
  return celsius * (9 / 5) + 32;
}
