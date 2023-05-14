import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faWindsock } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/weather";
import { HeaderType, Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";
import { useAppSelector } from "../../../hooks";
import { SpeedUnit } from "../../user/userSlice";
import { speedUnitFormatter } from "../../rap/cells/WindSpeed";

// When a gust is considered worth displaying
const GUST_DELTA_THRESHOLD = 2;

const colorScale = chroma
  .scale(["#ffffff66", "#ffffff", "#fffb00", "#ff0000"])
  .domain([10, 14, 16, 18]);

const WindIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "headerType",
})<{
  headerType: HeaderType;
  speed: number;
  gust: number;
}>`
  ${({ headerType, speed, gust }) =>
    headerType === HeaderType.Normal
      ? css`
          ${outputP3ColorFromRGBA(
            colorScale(getCompositeWindValue(speed, gust)).rgba()
          )}
        `
      : ""}
`;

interface WindProps {
  headerType: HeaderType;
  date: string;
  weather: WeatherResult | undefined;
}

export default function Wind({ headerType, date, weather }: WindProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const wind = useMemo(
    () =>
      typeof weather === "object"
        ? {
            speed: findValue(new Date(date), weather.properties.windSpeed),
            gust: findValue(new Date(date), weather.properties.windGust),
          }
        : undefined,
    [date, weather]
  );

  if (!wind || wind.speed == null || wind.gust == null) return <></>;

  const speed = Math.round(toMph(wind.speed.value));
  const gust = Math.round(toMph(wind.gust.value));

  const speedUnitLabel = speedUnitFormatter(speedUnit);
  const speedFormatted = Math.round(formatSpeed(wind.speed.value, speedUnit));
  const gustFormatted = Math.round(formatSpeed(wind.gust.value, speedUnit));

  const body =
    gust - speed < GUST_DELTA_THRESHOLD ? (
      <>{speedFormatted}</>
    ) : (
      <>
        {speedFormatted}G{gustFormatted}
      </>
    );

  return (
    <Tippy
      content={`Wind ${speedFormatted}${speedUnitLabel} gusting to ${gustFormatted}${speedUnitLabel}`}
      placement="bottom"
    >
      <div>
        <Micro
          icon={
            <WindIcon
              headerType={headerType}
              icon={faWindsock}
              speed={speed}
              gust={gust}
            />
          }
        >
          {body}
        </Micro>
      </div>
    </Tippy>
  );
}

function toMph(speed: number): number {
  return speed * 0.621371;
}

/**
 * @returns A "composite" wind value for gusts+sustained, similar to temperature "real feel"
 */
function getCompositeWindValue(speed: number, gust: number): number {
  return Math.max((gust - speed) * 2.5, speed, gust);
}

export function formatSpeed(speedInKph: number, speedUnit: SpeedUnit): number {
  switch (speedUnit) {
    case SpeedUnit.KPH:
      return speedInKph;
    case SpeedUnit.MPH:
      return speedInKph * 0.621371;
    case SpeedUnit.Knots:
      return speedInKph * 0.539957;
    case SpeedUnit.mps:
      return speedInKph * 0.277778;
  }
}
