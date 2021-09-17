import styled from "@emotion/styled/macro";
import { useEffect, useRef, useState } from "react";
import CinCape from "./CinCape";
import SunCalc from "suncalc";
import chroma, { Color, Scale } from "chroma-js";
import startOfTomorrow from "date-fns/startOfTomorrow";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { Rap } from "gsl-parser";
import Table from "./Table";

const Column = styled.div`
  position: relative;
`;

const TableContainer = styled.div`
  padding: 0.75em 0;

  position: relative;

  border-radius: 1em;
  box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);
`;

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
  const [yesterdayTimes] = useState(
    SunCalc.getTimes(subDays(new Date(rap.date), 1), rap.lat, -rap.lon)
  );
  const [times] = useState(
    SunCalc.getTimes(new Date(rap.date), rap.lat, -rap.lon)
  );

  const colorScale = useRef<Scale<Color>>();

  useEffect(() => {
    colorScale.current = chroma
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
      ]);
  }, [times, yesterdayTimes]);

  return (
    <Column {...rest}>
      <Header>
        <HourContainer>
          {format(new Date(rap.date), "h:mmaaaaa")}
          {new Date(rap.date).getTime() >= startOfTomorrow().getTime() && (
            <sup>+1</sup>
          )}
        </HourContainer>

        <CinCape cin={rap.cin} cape={rap.cape} />
      </Header>

      <TableContainer
        style={{
          backgroundColor:
            colorScale.current &&
            colorScale.current(new Date(rap.date).getTime()).css(),
        }}
      >
        <Table rap={rap} rows={rows} />
      </TableContainer>
    </Column>
  );
}
