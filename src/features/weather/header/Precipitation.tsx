import { css, keyframes } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faRaindrops } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/weather";
import { HeaderType, Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const snow = keyframes` 
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }
  100% {
    background-position: 500px 1000px, 400px 400px, 300px 300px;
  }
`;

const Snow = styled.div<{ chance: number }>`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("https://cdn.discordapp.com/attachments/744182992037216260/990023034524033105/snow1.png"),
    url("https://cdn.discordapp.com/attachments/744182992037216260/990023034758922250/snow2.png"),
    url("https://cdn.discordapp.com/attachments/744182992037216260/990023034951827556/snow3.png");
  z-index: -1;
  opacity: ${({ chance }) => chance / 2};

  animation: ${snow} 10s linear infinite;
`;

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
    <>
      {chance.value > 50 && <Snow chance={chance.value / 100} />}

      <Tippy
        content={`${chance.value}% chance precipitation`}
        placement="bottom"
      >
        <div>
          <Micro
            icon={
              <RainIcon
                headerType={headerType}
                icon={faRaindrops}
                chance={chance.value}
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
