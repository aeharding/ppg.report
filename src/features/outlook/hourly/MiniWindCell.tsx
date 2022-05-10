import styled from "@emotion/styled/macro";
import chroma from "chroma-js";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";

const colorScale = chroma
  .scale(["#002974", "#002974", "green", "green", "orange", "red", "purple"])
  .domain([0, 3, 9.5, 10, 14, 30, 50])
  .mode("lab");

const Bar = styled.div<{ windSpeed: number }>`
  max-height: 100%;
  height: ${({ windSpeed }) => ((windSpeed + 4) / 38) * 1.5}rem;
  width: 100%;

  ${({ windSpeed }) =>
    outputP3ColorFromRGBA(colorScale(windSpeed).rgba(), "background-color")};
`;

interface MiniWindCellProps {
  windSpeed: number;
}

export default function MiniWindCell({ windSpeed }: MiniWindCellProps) {
  return <Bar windSpeed={windSpeed} />;
}
