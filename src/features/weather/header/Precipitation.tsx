import styled from "@emotion/styled/macro";
import { faRaindrops } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/weather";
import { Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const colorScale = chroma
  .scale(["#ffffff88", "#ffffffff", "#006affff"])
  .domain([0, 30, 80]);

const RainIcon = styled(FontAwesomeIcon)<{ chance: number }>`
  ${({ chance }) => outputP3ColorFromRGBA(colorScale(chance).rgba())}
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

  if (chance.value < 5) return <></>;

  return (
    <Tippy content={`${chance.value}% chance precipitation`} placement="bottom">
      <div>
        <Micro icon={<RainIcon icon={faRaindrops} chance={chance.value} />}>
          {body}
        </Micro>
      </div>
    </Tippy>
  );
}
