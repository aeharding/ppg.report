import styled from "@emotion/styled/macro";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import chroma from "chroma-js";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { toMph } from "./Hourly";

const colorScale = chroma
  .scale(["#002974", "#002974", "green", "green", "orange", "red", "purple"])
  .domain([0, 3, 9.5, 10, 14, 30, 50])
  .mode("lab");

const Container = styled.div`
  height: 6rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const Bar = styled.div<{ windSpeed: number }>`
  min-height: 1.5rem;
  max-height: 100%;
  height: ${({ windSpeed }) => ((windSpeed + 4) / 38) * 100}%;
  width: 100%;

  ${({ windSpeed }) =>
    outputP3ColorFromRGBA(colorScale(windSpeed).rgba(), "background-color")};
`;

const TransformedIcon = styled(FontAwesomeIcon)<{ direction: number }>`
  transform: rotate(${({ direction }) => direction}deg);
`;

interface WindCellProps {
  windSpeed: number;
  direction?: number;
}

export default function WindCell({ windSpeed, direction }: WindCellProps) {
  const formattedSpeed = Math.round(toMph(windSpeed));

  return (
    <Container>
      {formattedSpeed}
      <Bar windSpeed={windSpeed}>
        {direction != null ? (
          <TransformedIcon icon={faLongArrowDown} direction={direction} />
        ) : (
          ""
        )}
      </Bar>
    </Container>
  );
}
