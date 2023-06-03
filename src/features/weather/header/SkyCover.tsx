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
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { findValue } from "../../../services/nwsWeather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";
import { useTranslation } from "react-i18next";
import Tooltip from "../../../shared/Tooltip";

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
  const { t } = useTranslation();
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  const [isDay] = useState(
    lat && lon
      ? SunCalc.getPosition(new Date(date), +lat, +lon).altitude > 0
      : true
  );

  const chance = useMemo(() => {
    if (typeof weather !== "object") return undefined;

    if ("properties" in weather)
      return findValue(
        new Date(date),

        weather.properties.skyCover
      )?.value;

    return weather.byUnixTimestamp[new Date(date).getTime() / 1_000]
      ?.cloudCover;
  }, [date, weather]);

  if (chance == null) return <></>;

  const icon = (() => {
    if (chance > 75) return faClouds;
    else if (chance > 35) return isDay ? faCloudsSun : faCloudsMoon;
    return isDay ? faSun : faMoon;
  })();

  const body = <>{chance}%</>;

  // if (chance.value <= SHOW_SKY_COVER_THRESHOLD) {
  //   return iconElement;
  // }

  return (
    <Tooltip contents={() => t("Sky Coverage", { percentage: `${chance}%` })}>
      <div>
        <Micro icon={<SkyIcon icon={icon} chance={chance} />}>{body}</Micro>
      </div>
    </Tooltip>
  );
}
