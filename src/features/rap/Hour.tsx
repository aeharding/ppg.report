import styled from "@emotion/styled/macro";
import { useState } from "react";
import CinCape from "./CinCape";
import SunCalc from "suncalc";
import chroma from "chroma-js";
import startOfTomorrow from "date-fns/startOfTomorrow";
import subDays from "date-fns/subDays";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { Rap } from "gsl-parser";
import Table from "./Table";
import WeatherHeader from "../weather/WeatherHeader";
import { css } from "@emotion/react/macro";
// import ReportBack from "../reportBack/ReportBack";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../weather/weatherSlice";
import { zonedTimeToUtc } from "date-fns-tz";

const Column = styled.div`
  position: relative;
`;

const Card = styled.div`
  position: relative;
`;

const CardInner = styled.div<{ flipped: boolean }>``;
/* transform-style: preserve-3d;
transition: transform 80ms ease-out;

${({ flipped }) =>
  flipped
    ? css`
        transform: rotateY(180deg);
      `
    : css`
        transform: rotateY(0);
      `} */

const cardFaceStyles = css`
  padding: 0.75em 0;

  border-radius: 1em;
  box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);

  backface-visibility: hidden;
`;

const CardFace = styled.div`
  ${cardFaceStyles}/* transform: rotateY(0); */
`;

// const CardFaceBack = styled.div`
//   ${cardFaceStyles}

//   position: absolute;
//   inset: 0;
//   transform: rotateY(180deg);
// `;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  margin: 0 1em;
`;

const HourContainer = styled.h3`
  font-size: 1.6em;
  font-weight: 200;
  margin: 0;

  sup {
    font-size: 0.6em;
    font-weight: 300;
    opacity: 0.6;
  }
`;

interface HourProps {
  rap: Rap;
  rows: number; // number of altitudes/rows to render
}

export default function Hour({ rap, rows, ...rest }: HourProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("Timezone not found");

  // const [flipped, setFlipped] = useState(false);

  const [yesterdayTimes] = useState(
    SunCalc.getTimes(subDays(new Date(rap.date), 1), rap.lat, -rap.lon)
  );
  const [times] = useState(
    SunCalc.getTimes(new Date(rap.date), rap.lat, -rap.lon)
  );

  const [colorScale] = useState(() =>
    chroma
      .scale([
        "#0000004d",
        "#6666660e",
        "#ffffff0a",
        "#ffffff0a",
        "#6666660e",
        "#0000004d",
        "#0000004d",
        "#6666660e",
        "#ffffff0a",
        "#ffffff0a",
        "#6666660e",
        "#0000004d",
      ])
      .mode("lch")
      .domain([
        yesterdayTimes.sunrise.getTime() - 1 * 60 * 60 * 1000,
        yesterdayTimes.sunrise.getTime() + 0.7 * 60 * 60 * 1000,
        yesterdayTimes.sunrise.getTime() + 3 * 60 * 60 * 1000,

        yesterdayTimes.sunset.getTime() - 4.5 * 60 * 60 * 1000,
        yesterdayTimes.sunset.getTime() - 4 * 60 * 60 * 1000,
        yesterdayTimes.sunset.getTime() + 0.5 * 60 * 60 * 1000,

        times.sunrise.getTime() - 1 * 60 * 60 * 1000,
        times.sunrise.getTime() + 0.7 * 60 * 60 * 1000,
        times.sunrise.getTime() + 3 * 60 * 60 * 1000,

        times.sunset.getTime() - 4.5 * 60 * 60 * 1000,
        times.sunset.getTime() - 4 * 60 * 60 * 1000,
        times.sunset.getTime() + 0.5 * 60 * 60 * 1000,
      ])
  );

  function onClick(e: React.MouseEvent) {
    // TODO: enable and implement backface of cards
    // if (e.target instanceof HTMLElement) {
    //   if (e.target.tagName === "A") return;
    // }
    // setFlipped(!flipped);
  }

  return (
    <Column {...rest}>
      <Header>
        <HourContainer>
          {formatInTimeZone(new Date(rap.date), timeZone, "h:mmaaaaa")}
          {new Date(rap.date).getTime() >=
            zonedTimeToUtc(startOfTomorrow(), timeZone).getTime() && (
            <sup>+1</sup>
          )}
        </HourContainer>

        <CinCape cin={rap.cin} cape={rap.cape} />
      </Header>

      <Card>
        <CardInner flipped={false}>
          <CardFace
            style={{
              backgroundColor: colorScale(new Date(rap.date).getTime()).css(),
            }}
            onClick={onClick}
          >
            <WeatherHeader date={rap.date} />
            <Table rap={rap} rows={rows} />
          </CardFace>

          {/* <CardFaceBack
            style={{
              backgroundColor: colorScale(new Date(rap.date).getTime()).css(),
            }}
            onClick={onClick}
          >
            <ReportBack date={rap.date} />
          </CardFaceBack> */}
        </CardInner>
      </Card>
    </Column>
  );
}
