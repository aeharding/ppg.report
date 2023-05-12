import styled from "@emotion/styled";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCloudHail,
  faCloudRain,
  faCloudSleet,
  faFog,
  faPooStorm,
  faRaindrops,
  faSmoke,
  faThunderstorm,
  faWind,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import lowerCase from "lodash/lowerCase";
import capitalize from "lodash/capitalize";
import { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { findValue } from "../../../services/weather";
import { WeatherObservation, WeatherResult } from "../weatherSlice";
import { keyframes } from "@emotion/css";
import { css } from "@emotion/react";
import { faSnowflake } from "@fortawesome/pro-light-svg-icons";

const thunderAnimate = keyframes`
  0% {
    opacity: 0.4;
  }
  23% {
    opacity: 0.4;
  }
  23.5% {
    opacity: 1;
  }
  24% {
    opacity: 0;
  }
  24.5% {
    opacity: 0.4;
  }
  
  45% {
    opacity: 0.4;
  }
  45.5% {
    opacity: 0.4;
  }
  46% {
    opacity: 1;
  }
  46.5% {
    opacity: 0;
  }
  47% {
    opacity: 0.4;
  }
  47.5% {
    opacity: 0.4;
  }
  48% {
    opacity: 1;
  }
  48.5% {
    opacity: 0;
  }
  49% {
    opacity: 0.4;
  }

  100% {
    opacity: 0.4;
  }
`;

const WeatherIcon = styled(FontAwesomeIcon)<{
  coverage: WeatherObservation["coverage"];
}>`
  font-size: 1.4em;
  margin-right: 0.5rem;

  &.fa-thunderstorm {
    ${outputP3ColorFromRGB([255, 255, 0])}

    ${({ coverage }) => {
      switch (coverage) {
        case "slight_chance":
        case "chance":
          return;
        default:
          return css`
            .fa-secondary {
              animation: ${thunderAnimate} 10s linear infinite;
            }
          `;
      }
    }}
  }
`;

const Flex = styled.div`
  display: flex;
`;

interface WeatherProps {
  date: string;
  weather: WeatherResult | undefined;
}

export default function Weather({ date, weather }: WeatherProps) {
  const observations = useMemo(
    () =>
      typeof weather === "object"
        ? findValue(
            new Date(date),

            weather.properties.weather
          )
        : undefined,
    [date, weather]
  )?.value;

  if (!observations) return <></>;

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

  if (!icon) return <></>;

  return (
    <Tippy content={tooltip} placement="bottom">
      <Flex>
        <WeatherIcon icon={icon} coverage={observation.coverage} />
      </Flex>
    </Tippy>
  );
}

function findIconFor(observation: WeatherObservation): IconProp | undefined {
  switch (observation.weather) {
    case "drizzle":
      return faRaindrops;
    case "dust":
    case "sand":
    case "sand_storm":
    case "volcanic_ash":
    case "unknown":
      return;
    case "dust_storm":
    case "dust_whirls":
      return faWind;
    case "fog":
    case "fog_mist":
    case "haze":
      return faFog;
    case "funnel_cloud":
      return faPooStorm;
    case "hail":
      return faCloudHail;
    case "ice_crystals":
    case "ice_pellets":
      return faCloudSleet;
    case "rain":
    case "spray":
    case "rain_showers":
      return faCloudRain;
    case "smoke":
      return faSmoke;
    case "snow":
    case "snow_grains":
    case "snow_pellets":
    case "snow_showers":
      return faSnowflake;
    case "squalls":
      return faWind;
    case "thunderstorms":
      return faThunderstorm;
  }
}
