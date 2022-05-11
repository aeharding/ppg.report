import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import capitalize from "lodash/capitalize";
import lowerCase from "lodash/lowerCase";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { findIconFor } from "../../weather/header/Weather";
import { WeatherObservation } from "../../weather/weatherSlice";

const Container = styled.div``;

const StyledIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "greyed",
})<{ greyed: boolean }>`
  ${({ greyed }) =>
    greyed
      ? css`
          opacity: 0.65;
        `
      : css`
          &.fa-thunderstorm {
            ${outputP3ColorFromRGB([255, 255, 0])}
          }
        `}
`;

interface SkyCoverCellProps {
  weather: WeatherObservation[];
}

export default function SkyCoverCell({
  weather: observations,
}: SkyCoverCellProps) {
  const observation: WeatherObservation | undefined =
    observations.find(({ weather }) => weather === "thunderstorms") ||
    observations[0];

  if (!observation) return <></>;

  let tooltip = capitalize(
    observations
      .map((observation) =>
        [observation.coverage, observation.weather].map(lowerCase).join(" ")
      )
      .join(", ")
  );

  let chance = observations.every((obs) => {
    switch (obs.coverage) {
      case "chance":
      case "slight_chance":
        return true;
      default:
        return false;
    }
  });

  const icon = findIconFor(observation);

  if (!icon) return <></>;

  return (
    <Container>
      <Tippy content={tooltip}>
        <div>
          <StyledIcon icon={icon} greyed={chance} />
        </div>
      </Tippy>
    </Container>
  );
}
