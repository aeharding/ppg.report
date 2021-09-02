import styled from "@emotion/styled/macro";
import { css } from "@emotion/react/macro";
import { Aside } from "./Height";
import chroma from "chroma-js";
import { shearIndicator } from "./WindDirection";

const colorScale = chroma
  .scale(["green", "green", "white", "white", "orange", "red", "purple"])
  .domain([0, 4, 5.5, 10, 14, 30, 50]);

const WindSpeedContainer = styled.div<{ speed: number; shear: boolean }>`
  position: relative;

  color: ${({ speed }) => colorScale(speed).css()};

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
