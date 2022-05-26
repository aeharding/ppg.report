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

enum Color {
  Yellow,
  White,
  Grey,
  DarkGrey,
}

const StyledIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ iconColor: Color }>`
  ${({ iconColor }) => {
    switch (iconColor) {
      case Color.DarkGrey:
        return css`
          color: rgba(255, 255, 255, 0.3);
        `;
      case Color.Grey:
        return css`
          color: rgba(255, 255, 255, 0.6);
        `;
      case Color.White:
        return css`
          color: white;
        `;
      case Color.Yellow:
        return css`
          ${outputP3ColorFromRGB([255, 255, 0])}
        `;
    }
  }}
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

  const icon = findIconFor(observation);

  const coverages = observations.map(({ coverage }) => coverage);
  let color = Color.Grey;

  if (
    observation.weather === "thunderstorms" &&
    observation.coverage !== "slight_chance" &&
    observation.coverage !== "chance"
  ) {
    color = Color.Yellow;
  } else if (
    coverages.includes("likely") ||
    coverages.includes("definite") ||
    coverages.includes("frequent")
  ) {
    color = Color.White;
  } else if (
    coverages.includes("slight_chance") &&
    observation.weather !== "thunderstorms"
  ) {
    color = Color.DarkGrey;
  }

  if (!icon) return <></>;

  return (
    <Container>
      <Tippy content={tooltip}>
        <div>
          <StyledIcon icon={icon} iconColor={color} />
        </div>
      </Tippy>
    </Container>
  );
}
