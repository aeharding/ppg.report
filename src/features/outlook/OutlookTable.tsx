import { addDays, eachHourOfInterval, startOfDay } from "date-fns";
import { findValue, NWSWeather } from "../../services/nwsWeather";
import { timeZoneSelector, Weather } from "../weather/weatherSlice";
import { OpenMeteoWeather } from "../../services/openMeteo";
import { useMemo } from "react";
import OutlookRow from "./OutlookRow";
import compact from "lodash/fp/compact";
import styled from "@emotion/styled";
import Day from "./Day";
import { TZDate } from "@date-fns/tz";
import { useAppSelector } from "../../hooks";

const Rows = styled.div``;

interface OutlookTableProps {
  weather: Weather;
}

function getOutlook(
  timeZone: string,
  mapFn: (hour: Date, index: number) => React.ReactNode | undefined,
) {
  const hours = eachHourOfInterval({
    start: new Date(),
    end: addDays(new Date(), 7),
  });

  const data = compact(
    hours.map((hour, index) => ({ node: mapFn(hour, index), hour })),
  );

  return Object.entries(
    Object.groupBy(data, ({ hour }) =>
      startOfDay(new TZDate(hour, timeZone)).getTime(),
    ),
  ).map(([timeStr, hours]) => ({
    date: new Date(+timeStr),
    hours: hours!.map(({ node }) => node),
  }));
}

export default function OutlookTable({ weather }: OutlookTableProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone needed");

  const rows = (() => {
    if ("properties" in weather)
      return <NWSOutlookRows weather={weather} timeZone={timeZone} />;
    return <OpenMeteoOutlookRows weather={weather} timeZone={timeZone} />;
  })();

  return <Rows>{rows}</Rows>;
}

interface BaseOutlookRowsProps {
  timeZone: string;
}

function NWSOutlookRows({
  weather,
  timeZone,
}: BaseOutlookRowsProps & {
  weather: NWSWeather;
}) {
  const days = useMemo(
    () =>
      getOutlook(timeZone, (hour, index) => {
        const windDirection = findValue(
          hour,
          weather.properties.windDirection,
        )?.value;
        const windSpeed = findValue(hour, weather.properties.windSpeed)?.value;
        const windGust = findValue(hour, weather.properties.windGust)?.value;
        const temperature = findValue(
          hour,
          weather.properties.temperature,
        )?.value;
        const observations = findValue(hour, weather.properties.weather)?.value;
        const skyCover = findValue(hour, weather.properties.skyCover)?.value;

        if (windDirection == null) return;
        if (windSpeed == null) return;
        if (windGust == null) return;
        if (temperature == null) return;
        if (observations == null) return;
        if (skyCover == null) return;

        return (
          <OutlookRow
            key={index}
            hour={hour}
            windDirection={windDirection}
            windSpeed={windSpeed}
            windGust={windGust}
            temperature={temperature}
            observations={observations}
            skyCover={skyCover}
          />
        );
      }),
    [weather, timeZone],
  );

  return days.map(({ date, hours }, index) => (
    <Day key={index} date={date} hours={hours} />
  ));
}

function OpenMeteoOutlookRows({
  weather,
  timeZone,
}: BaseOutlookRowsProps & {
  weather: OpenMeteoWeather;
}) {
  const days = useMemo(
    () =>
      getOutlook(timeZone, (hour, index) => {
        const data = weather.byUnixTimestamp[hour.getTime() / 1_000];

        if (!data) return;

        return (
          <OutlookRow
            key={index}
            hour={hour}
            windDirection={data.windDirection}
            windSpeed={data.windSpeed}
            windGust={data.windGust}
            temperature={data.temperature}
            observations={data.weather}
            skyCover={data.cloudCover}
          />
        );
      }),
    [weather, timeZone],
  );

  return days.map(({ date, hours }, index) => (
    <Day key={index} date={date} hours={hours} />
  ));
}
