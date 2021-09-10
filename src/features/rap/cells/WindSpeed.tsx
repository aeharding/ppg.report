import styled from "@emotion/styled/macro";
import { css } from "@emotion/react/macro";
import { Aside } from "./Height";
import chroma from "chroma-js";
import { shearIndicator } from "./WindDirection";
import { outputP3ColorFromLab } from "../../../helpers/colors";

const colorScale = chroma
  .scale(["#00FF00", "#00FF00", "white", "white", "orange", "red", "purple"])
  .domain([0, 3, 9.5, 10, 14, 30, 50])
  .mode("lab");

const WindSpeedContainer = styled.div<{ speed: number; shear: boolean }>`
  position: relative;

  ${({ speed }) => outputP3ColorFromLab(colorScale(speed).lab())};

  ${({ shear }) =>
    shear &&
    css`
      &:after {
        ${shearIndicator}
      }
    `}
`;

interface WindSpeedProps {
  // todo: check wind units provided on rap
  curr: number; // in knots, usually
  prev?: number;
}

export default function WindSpeed({ curr, prev }: WindSpeedProps) {
  return (
    <WindSpeedContainer
      speed={curr}
      shear={Math.abs(curr - (prev === undefined ? curr : prev)) > 8}
    >
      {Math.round(curr * 1.15078)} <Aside>mph</Aside>
    </WindSpeedContainer>
  );
}
