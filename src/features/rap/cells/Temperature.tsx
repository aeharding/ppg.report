import { Theme } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import chroma from "chroma-js";
import { Aside } from "./Height";

const colorScale = ({ text, yellow }: Theme) => {
  return chroma
    .scale(["blue", text, text, yellow, "red"])
    .domain([25, 73, 82, 87, 95]);
};

const TemperatureContainer = styled.div<{ temperature: number }>`
  color: ${({ temperature, theme }) => colorScale(theme)(temperature).css()};
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
