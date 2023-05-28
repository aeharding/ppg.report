import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faRaindrops } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/nwsWeather";
import { HeaderType, Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";
import PrecipitationAnimation from "./precipitationAnimation/PrecipitationAnimation";

const colorScale = chroma
  .scale(["#ffffff88", "#ffffffff", "#006affff"])
  .domain([0, 30, 80]);

const RainIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "headerType",
})<{
  headerType: HeaderType;
  chance: number;
}>`
  ${({ headerType, chance }) =>
    headerType === HeaderType.Normal
      ? css`
          ${outputP3ColorFromRGBA(colorScale(chance).rgba())}
        `
      : css`
          opacity: ${1 / 2 + chance / 200};
        `}
`;

interface PrecipitationProps {
  headerType: HeaderType;
  date: string;
  weather: WeatherResult | undefined;
}

export default function Precipitation({
  headerType,
  date,
  weather,
}: PrecipitationProps) {
  const chance = useMemo(() => {
    if (typeof weather !== "object") return undefined;

    if ("properties" in weather)
      return findValue(
        new Date(date),

        weather.properties.probabilityOfPrecipitation
      )?.value;

    return weather.byUnixTimestamp[new Date(date).getTime() / 1000]
      ?.precipitationChance;
  }, [date, weather]);

  if (chance == null) return <></>;

  const body = <>{chance}%</>;

  if (chance < 5) return <></>;

  return (
    <>
      {chance > 50 && (
        <PrecipitationAnimation
          chance={chance / 100}
          isSnow={false}
          hasOverlay={headerType !== HeaderType.Normal}
        />
      )}

      <Tippy content={`${chance}% chance precipitation`} placement="bottom">
        <div>
          <Micro
            icon={
              <RainIcon
                headerType={headerType}
                icon={faRaindrops}
                chance={chance}
              />
            }
          >
            {body}
          </Micro>
        </div>
      </Tippy>
    </>
  );
}
