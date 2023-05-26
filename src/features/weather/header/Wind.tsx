import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faWindsock } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/nwsWeather";
import { HeaderType, Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";
import { useAppSelector } from "../../../hooks";
import { SpeedUnit as MetarTafSpeedUnit } from "metar-taf-parser";
import { formatWind } from "../../../helpers/taf";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const wind = useMemo(() => {
    if (typeof weather !== "object") return undefined;

    if ("properties" in weather)
      return {
        speed: findValue(new Date(date), weather.properties.windSpeed)?.value,
        gust: findValue(new Date(date), weather.properties.windGust)?.value,
      };

    const hour = weather.byUnixTimestamp[new Date(date).getTime() / 1_000];
    if (!hour) return undefined;
    return {
      speed: hour.windSpeed,
      gust: hour.windGust,
    };
  }, [date, weather]);

  if (!wind || wind.speed == null || wind.gust == null) return <></>;

  const speed = Math.round(toMph(wind.speed));
  const gust = Math.round(toMph(wind.gust));

  const speedFormatted = formatWind(
    wind.speed,
    MetarTafSpeedUnit.KilometersPerHour,
    speedUnit,
    false
  );
  const gustFormatted = formatWind(
    wind.gust,
    MetarTafSpeedUnit.KilometersPerHour,
    speedUnit,
    false
  );

  const body =
    gust - speed < GUST_DELTA_THRESHOLD ? (
      <>{speedFormatted}</>
    ) : (
      <>
        {speedFormatted}
        {t("WindGustAsOneLetter")}
        {gustFormatted}
      </>
    );

  return (
    <Tippy
      content={t("WindSpeedGustingToWindSpeed", {
        baseWindSpeed: formatWind(
          wind.speed,
          MetarTafSpeedUnit.KilometersPerHour,
          speedUnit
        ),
        gustWindSpeed: formatWind(
          wind.gust,
          MetarTafSpeedUnit.KilometersPerHour,
          speedUnit
        ),
      })}
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
