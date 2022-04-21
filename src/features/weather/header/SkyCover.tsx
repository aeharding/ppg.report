import styled from "@emotion/styled/macro";
import { faClouds, faCloud } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { useMemo } from "react";
import { findValue } from "../../../services/weather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const SkyIcon = styled(FontAwesomeIcon)<{ chance: number }>`
  opacity: ${({ chance }) => 1 / 2 + chance / 200};
`;

interface SkyCoverProps {
  date: string;
  weather: WeatherResult | undefined;
}

const SHOW_SKY_COVER_THRESHOLD = 15;

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

  const icon = (() => {
    if (chance?.value > 75) return faClouds;
    return faCloud;
  })();

  const body = <>{chance.value}%</>;

  if (chance.value <= SHOW_SKY_COVER_THRESHOLD) {
    return <></>;
  }

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
