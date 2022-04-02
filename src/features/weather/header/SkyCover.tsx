import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faCloud, faClouds } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { findValue } from "../../../services/weather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const THRESHOLD = 75;

const SkyIcon = styled(FontAwesomeIcon)<{ chance: number }>`
  ${({ chance }) =>
    chance < THRESHOLD &&
    css`
      opacity: 0.5;
      transform: scale(0.7);
    `}
`;

interface SkyCoverProps {
  date: string;
  weather: WeatherResult | undefined;
}

export default function SkyCover({ date, weather }: SkyCoverProps) {
  const chance = useMemo(
    () =>
      typeof weather === "object"
        ? findValue(
            new Date(date),

            weather.properties.skyCover
          )
        : undefined,
    [date, weather]
  );

  if (!chance) return <></>;

  const body = <>{chance.value}%</>;

  return (
    <Micro
      icon={
        <SkyIcon
          icon={chance.value < THRESHOLD ? faCloud : faClouds}
          chance={chance.value}
        />
      }
    >
      {body}
    </Micro>
  );
}
