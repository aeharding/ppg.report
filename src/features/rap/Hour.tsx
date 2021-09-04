/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled/macro";
import { useEffect, useState } from "react";
import CinCape from "./CinCape";
import SunCalc from "suncalc";
import chroma from "chroma-js";
import startOfTomorrow from "date-fns/startOfTomorrow";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { Rap } from "gsl-parser";
import Table from "./Table";
import { useAppSelector } from "../../hooks";
import { Themes } from "../../theme";

const Column = styled.div`
  position: relative;
`;

const TableContainer = styled.div`
  padding: 0.75em 0;

  position: relative;

  border-radius: 1em;
  box-shadow: var(--table-box-shadow);
  border: var(--rim);
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

const getColorScale = (
  lat: number,
  lon: number,
  date: string,
  theme: Themes
) => {
  const yesterdayTimes = SunCalc.getTimes(subDays(new Date(date), 1), lat, lon);
  const times = SunCalc.getTimes(new Date(date), lat, lon);

  switch (theme) {
    case Themes.Dark: {
      const night = "#0000004d";
      const transition = "#6666660e";
      const day = "#ffffff0a";

      return chroma
        .scale([
          night,
          transition,
          day,
          day,
          transition,
          night,
          night,
          transition,
          day,
          day,
          transition,
          night,
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
    }
    case Themes.Light: {
      const night = "#c8d6ec8d";
      const transition = "#ffffffeb";
      const day = "#fff";

      return chroma
        .scale([
          night,
          transition,
          day,
          day,
          transition,
          night,
          night,
          transition,
          day,
          day,
          transition,
          night,
        ])
        .mode("lch")
        .domain([
          yesterdayTimes.sunrise.getTime() - 2 * 60 * 60 * 1000,
          yesterdayTimes.sunrise.getTime() + 0.5 * 60 * 60 * 1000,
          yesterdayTimes.sunrise.getTime() + 3 * 60 * 60 * 1000,

          yesterdayTimes.sunset.getTime() - 4 * 60 * 60 * 1000,
          yesterdayTimes.sunset.getTime() - 1.5 * 60 * 60 * 1000,
          yesterdayTimes.sunset.getTime() + 1 * 60 * 60 * 1000,

          times.sunrise.getTime() - 2 * 60 * 60 * 1000,
          times.sunrise.getTime() + 0.5 * 60 * 60 * 1000,
          times.sunrise.getTime() + 3 * 60 * 60 * 1000,

          times.sunset.getTime() - 4 * 60 * 60 * 1000,
          times.sunset.getTime() - 1.5 * 60 * 60 * 1000,
          times.sunset.getTime() + 1 * 60 * 60 * 1000,
        ]);
    }
  }
};

export default function Hour({ rap, rows, ...rest }: HourProps) {
  const theme = useAppSelector((state) => state.user.theme);
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    setBackgroundColor(
      getColorScale(
        rap.lat,
        -rap.lon,
        rap.date,
        theme
      )(new Date(rap.date).getTime()).css()
    );
  }, [rap, theme]);

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

      <TableContainer css={{ backgroundColor }}>
        <Table rap={rap} rows={rows} />
      </TableContainer>
    </Column>
  );
}
