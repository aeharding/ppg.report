import styled from "@emotion/styled";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { findValue, NWSWeatherObservation } from "../../../services/nwsWeather";
import { WeatherResult } from "../weatherSlice";
import { keyframes } from "@emotion/css";
import { css } from "@emotion/react";
import NWSWeather from "./NWSWeather";
import WMOWeather from "./WMOWeather";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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

export const WeatherIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "lightning",
})<{
  lightning?: boolean;
}>`
  font-size: 1.4em;
  margin-right: 0.5rem;

  &.fa-thunderstorm {
    ${outputP3ColorFromRGB([255, 255, 0])}

    ${({ lightning }) =>
      lightning &&
      css`
        .fa-secondary {
          animation: ${thunderAnimate} 10s linear infinite;
        }
      `}
  }
`;

interface WeatherProps {
  date: string;
  weather: WeatherResult | undefined;
}

export default function Weather({ date, weather }: WeatherProps) {
  const observations = useMemo(() => {
    if (typeof weather !== "object") return undefined;

    if ("properties" in weather)
      return findValue(
        new Date(date),

        weather.properties.weather,
      )?.value;

    return weather.byUnixTimestamp[new Date(date).getTime() / 1_000]?.weather;
  }, [date, weather]);

  if (!observations) return <></>;

  return <Observations data={observations} />;
}

interface ObservationsProps {
  data: number | NWSWeatherObservation[];
  defaultIcon?: IconProp | undefined;
  className?: string;
}

export function Observations({ data, ...rest }: ObservationsProps) {
  if (Array.isArray(data)) return <NWSWeather observations={data} {...rest} />;

  return <WMOWeather wmoCode={data} {...rest} />;
}
