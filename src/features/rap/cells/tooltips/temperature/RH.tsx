import styled from "@emotion/styled";
import chroma from "chroma-js";
import { outputP3ColorFromRGB } from "../../../../../helpers/colors";

const colorScale = chroma
  .scale(["red", "#ffea00", "white", "#00ff00", "#00aeff", "#00aeff"])
  .domain([0, 30, 35, 70, 85, 100]);

const Cell = styled.td<{ rh: number }>`
  ${({ rh }) => outputP3ColorFromRGB(colorScale(rh).rgb())}
`;

interface RHProps {
  rh: number;
}

export default function RH({ rh }: RHProps) {
  return (
    <>
      <Cell rh={rh}>{Math.round(rh * 10) / 10}</Cell>
      <Cell rh={rh}>%</Cell>
    </>
  );
}
