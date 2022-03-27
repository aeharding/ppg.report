import styled from "@emotion/styled/macro";
import chroma from "chroma-js";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { Aside } from "./Altitude";

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#00ff00", "yellow", "red"])
  .domain([-5, 32, 60, 86, 95]);

const TemperatureContainer = styled.div<{ temperature: number }>`
  ${({ temperature }) => outputP3ColorFromRGB(colorScale(temperature).rgb())}
`;

interface TemperatureProps {
  temperature: number; // tenths of a degree Celsius
}

export default function Temperature({
  temperature: tenthsDegC,
}: TemperatureProps) {
  const temperature = getFahrenheitFromCelsius(tenthsDegC / 10);

  return (
    <TemperatureContainer temperature={temperature}>
      {Math.round(temperature)} <Aside>°F</Aside>
    </TemperatureContainer>
  );
}

function getFahrenheitFromCelsius(celsius: number): number {
  return celsius * (9 / 5) + 32;
}
