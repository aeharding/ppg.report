import { formatInTimeZone } from "date-fns-tz";
import { timeZoneSelector } from "../weather/weatherSlice";
import { useAppSelector } from "../../hooks";
import styled from "@emotion/styled";
import WindIndicator from "../rap/WindIndicator";
import WindSpeed from "./WindSpeed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/pro-duotone-svg-icons";
import chroma from "chroma-js";
import { getCompositeWindValue } from "../weather/header/Wind";
import SunCalc from "suncalc";

export const windColorScale = chroma
  .scale([
    "#00FF0099",
    "#00FF0099",
    "#eaff0099",
    "#FFA50099",
    "#FF000099",
    "#FF000099",
    "#FF10F0",
    "#AD2AFF",
    "white",
  ])
  .domain([0, 5.56, 18, 25.93, 55.56, 64.82, 138.9, 185.2, 296.32])
  .mode("lab");

const Row = styled.tr<{ speed: number; color: string; day: boolean }>`
  height: 50px;

  border-bottom: 1px solid #77777715;

  position: relative;
  // https://github.com/w3c/csswg-drafts/issues/1899#issuecomment-338773780
  transform: scale(1);

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    height: 50px;
    inset: 0;
    background: linear-gradient(
      in oklab 90deg,
      ${({ color }) => color},
      ${({ color }) => color} ${({ speed }) => speed}%,
      ${({ day }) => (day ? "#ffffff0a" : "transparent")}
        calc(${({ speed }) => speed}% + 80px)
    );
  }
`;

const TimeCell = styled.td`
  text-align: center;
  vertical-align: middle;
`;

const Time = styled.div`
  display: inline-block;
  padding: 3px 5px;
  font-size: 12px;
  background: var(--bg-bottom-sheet);
  border-radius: 16px;
`;

interface OutlookRowProps {
  hour: Date;
  windDirection: number;
  windSpeed: number;
  windGust: number;
}

export default function OutlookRow({
  hour,
  windDirection,
  windSpeed,
  windGust,
}: OutlookRowProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone needed");

  const coordinates = useAppSelector((state) => state.weather.coordinates);
  if (!coordinates) throw new Error("coordinates not found");

  const time = formatInTimeZone(hour, timeZone, "hha");

  const compositeSpeed = getCompositeWindValue(windSpeed, windGust) * 0.7;

  const color = (() => {
    const [r, g, b, a] = windColorScale(compositeSpeed).rgba();

    return `color(display-p3 ${r / 255} ${g / 255} ${b / 255} / ${a})`;
  })();

  const isDay =
    SunCalc.getPosition(hour, coordinates.lat, coordinates.lon).altitude > 0;

  return (
    <Row speed={compositeSpeed} color={color} day={isDay}>
      <TimeCell>
        <Time>{time}</Time>
      </TimeCell>
      <td>
        <WindIndicator direction={windDirection} />
      </td>
      <td>
        <WindSpeed speed={windSpeed} gust={windGust} />
      </td>
      <td>
        <FontAwesomeIcon icon={isDay ? faSun : faMoon} />
      </td>
      <td>47deg</td>
    </Row>
  );
}
