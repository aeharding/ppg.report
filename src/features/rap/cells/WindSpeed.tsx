import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Aside } from "./Altitude";
import chroma from "chroma-js";
import { shearIndicator } from "./WindDirection";
import { outputP3ColorFromLab } from "../../../helpers/colors";
import { useMemo } from "react";

const colorScale = chroma
  .scale([
    "#00FF00",
    "#00FF00",
    "white",
    "white",
    "orange",
    "red",
    "red",
    "#FF10F0",
    "#AD2AFF",
    "white",
  ])
  .domain([0, 3, 9.5, 10, 14, 30, 35, 75, 100, 160])
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
  const content = useMemo(() => {
    return (
      <WindSpeedContainer
        speed={curr}
        shear={Math.abs(curr - (prev === undefined ? curr : prev)) > 8}
      >
        {Math.round(curr * 1.15078)} <Aside>mph</Aside>
      </WindSpeedContainer>
    );
  }, [curr, prev]);

  return content;
}
