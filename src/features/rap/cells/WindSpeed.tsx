import styled from "@emotion/styled/macro";
import { Aside } from "./Height";
import chroma from "chroma-js";

const colorScale = chroma
  .scale(["green", "green", "white", "white", "orange", "red", "purple"])
  .domain([0, 4, 5.5, 10, 14, 30, 50]);

const WindSpeedContainer = styled.span<{ speed: number }>`
  color: ${({ speed }) => colorScale(speed).css()};
`;

interface WindSpeedProps {
  speed: number; // in knots, usually
  // todo: check wind units provided on rap
}

export default function WindSpeed({ speed }: WindSpeedProps) {
  return (
    <WindSpeedContainer speed={speed}>
      {Math.round(speed * 1.15078)} <Aside>mph</Aside>
    </WindSpeedContainer>
  );
}
