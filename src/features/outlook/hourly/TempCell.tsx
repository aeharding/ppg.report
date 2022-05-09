import styled from "@emotion/styled/macro";
import chroma from "chroma-js";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#008600", "#b07500", "#910000"])
  .domain([-5, 32, 60, 86, 95]);

const Container = styled.div<{ temperature: number }>`
  ${({ temperature }) =>
    outputP3ColorFromRGBA(colorScale(temperature).rgba(), "background-color")};
`;

interface TempCellProps {
  temperature: number;
}

export default function TempCell({ temperature }: TempCellProps) {
  const formattedTemperature = Math.round(
    getFahrenheitFromCelsius(temperature)
  );

  return (
    <Container temperature={formattedTemperature}>
      {formattedTemperature}
    </Container>
  );
}

function getFahrenheitFromCelsius(celsius: number): number {
  return celsius * (9 / 5) + 32;
}
