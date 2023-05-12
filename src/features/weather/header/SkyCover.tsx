import SunCalc from "suncalc";
import styled from "@emotion/styled";
import {
  faClouds,
  faCloudsSun,
  faSun,
  faCloudsMoon,
  faMoon,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { findValue } from "../../../services/weather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const SkyIcon = styled(FontAwesomeIcon)<{ chance: number }>`
  &.fa-sun {
    transform: scale(1.2);
    color: yellow;
  }

  &.fa-clouds-sun {
    --fa-secondary-color: yellow;
    --fa-secondary-opacity: 0.8;
  }
`;

interface SkyCoverProps {
  date: string;
  weather: WeatherResult | undefined;
}

export default function SkyCover({ date, weather }: SkyCoverProps) {
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  const [isDay] = useState(
    lat && lon
      ? SunCalc.getPosition(new Date(date), +lat, +lon).altitude > 0
      : true
  );

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

  const icon = (() => {
    if (chance?.value > 75) return faClouds;
    else if (chance?.value > 35) return isDay ? faCloudsSun : faCloudsMoon;
    return isDay ? faSun : faMoon;
  })();

  const body = <>{chance.value}%</>;

  // if (chance.value <= SHOW_SKY_COVER_THRESHOLD) {
  //   return iconElement;
  // }

  return (
    <Tippy content={`${chance.value}% sky cover`} placement="bottom">
      <div>
        <Micro icon={<SkyIcon icon={icon} chance={chance.value} />}>
          {body}
        </Micro>
      </div>
    </Tippy>
  );
}
