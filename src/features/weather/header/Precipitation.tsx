import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faRaindrops } from "@fortawesome/pro-light-svg-icons";
import { faRaindrops as faRaindropsSolid } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { findValue } from "../../../services/weather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const THRESHOLD = 25;

const RainIcon = styled(FontAwesomeIcon)<{ chance: number }>`
  ${({ chance }) =>
    chance > THRESHOLD &&
    css`
      color: #006affec;
    `}
`;

interface PrecipitationProps {
  date: string;
  weather: WeatherResult | undefined;
}

export default function Precipitation({ date, weather }: PrecipitationProps) {
  const chance = useMemo(
    () =>
      typeof weather === "object"
        ? findValue(
            new Date(date),

            weather.properties.probabilityOfPrecipitation
          )
        : undefined,
    [date, weather]
  );

  if (!chance) return <></>;

  const body = <>{chance.value}%</>;

  return (
    <Micro
      icon={
        <RainIcon
          icon={chance.value > THRESHOLD ? faRaindropsSolid : faRaindrops}
          chance={chance.value}
        />
      }
    >
      {body}
    </Micro>
  );
}
