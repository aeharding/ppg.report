import styled from "@emotion/styled/macro";
import chroma from "chroma-js";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { toMph } from "./Hourly";

const colorScale = chroma
  .scale(["#002974", "#002974", "green", "green", "orange", "red", "purple"])
  .domain([0, 3, 9.5, 13, 16, 30, 50])
  .mode("lab");

const Container = styled.div<{ windGust: number }>`
  ${({ windGust }) =>
    outputP3ColorFromRGBA(colorScale(windGust).rgba(), "background-color")};
`;

interface GustCellProps {
  windGust: number;
}

export default function GustCell({ windGust }: GustCellProps) {
  const formattedSpeed = Math.round(toMph(windGust));

  return <Container windGust={formattedSpeed}>{formattedSpeed}</Container>;
}
