import styled from "@emotion/styled";
import { useState } from "react";
import CinCape from "./CinCape";
import SunCalc from "suncalc";
import chroma from "chroma-js";
import subDays from "date-fns/subDays";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import Table from "./Table";
import WeatherHeader from "../weather/WeatherHeader";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector, windsAloft } from "../weather/weatherSlice";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { getTimeFormatString } from "../weather/aviation/Forecast";
import { WindsAloftHour } from "../../models/WindsAloft";
import { isValidDate } from "../../helpers/date";
import { addDays, startOfDay } from "date-fns";

const Column = styled.div`
  position: relative;
`;

const Card = styled.div`
  position: relative;

  padding: 0.75em 0;

  border-radius: 1em;
  box-shadow: var(--card-box-shadow);
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
  hour: WindsAloftHour;
  rows: number; // number of altitudes/rows to render
  surfaceLevelMode: boolean;
}

export default function Hour({
  hour,
  rows,
  surfaceLevelMode,
  ...rest
}: HourProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  const timeFormat = useAppSelector((state) => state.user.timeFormat);
  const windsAloftResult = useAppSelector(windsAloft);

  if (typeof windsAloftResult !== "object")
    throw new Error("Winds aloft should be resolved");

  if (!timeZone) throw new Error("Timezone not found");

  const [yesterdayTimes] = useState(
    SunCalc.getTimes(
      subDays(new Date(hour.date), 1),
      windsAloftResult.latitude,
      windsAloftResult.longitude
    )
  );
  const [times] = useState(
    SunCalc.getTimes(
      new Date(hour.date),
      windsAloftResult.latitude,
      windsAloftResult.longitude
    )
  );

  const [colorScale] = useState(() => {
    if (!isValidDate(times.sunrise)) return chroma.scale(["#ffffff0a"]);
    return chroma
      .scale([
        "#0088ff4d",
        "#7430000a",
        "#ffffff0a",
        "#ffffff0a",
        "#7430000a",
        "#0088ff4d",
        "#0088ff4d",
        "#7430000a",
        "#ffffff0a",
        "#ffffff0a",
        "#7430000a",
        "#0088ff4d",
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
  });

  return (
    <Column {...rest}>
      <Header>
        <HourContainer>
          {formatInTimeZone(
            new Date(hour.date),
            timeZone,
            getTimeFormatString(timeFormat, true)
          )}
          {new Date(hour.date).getTime() >=
            startOfTomorrowInTimeZone(timeZone).getTime() && <sup>+1</sup>}
        </HourContainer>

        <CinCape cin={hour.cin} cape={hour.cape} />
      </Header>

      <Card
        style={{
          backgroundColor: colorScale(new Date(hour.date).getTime()).css(),
        }}
      >
        <WeatherHeader date={hour.date} />
        <Table
          windsAloftHour={hour}
          rows={rows}
          surfaceLevelMode={surfaceLevelMode}
        />
      </Card>
    </Column>
  );
}

function startOfTomorrowInTimeZone(timeZone: string): Date {
  return zonedTimeToUtc(
    startOfDay(utcToZonedTime(addDays(new Date(), 1), timeZone)),
    timeZone
  );
}
