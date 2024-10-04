import { addDays, eachHourOfInterval, startOfDay } from "date-fns";
import { findValue, NWSWeather } from "../../services/nwsWeather";
import { Weather } from "../weather/weatherSlice";
import { OpenMeteoWeather } from "../../services/openMeteo";
import { useMemo } from "react";
import OutlookRow from "./OutlookRow";
import compact from "lodash/fp/compact";
import styled from "@emotion/styled";
import Day from "./Day";

const Rows = styled.div``;

interface OutlookTableProps {
  weather: Weather;
}

function getOutlook(
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
    Object.groupBy(data, ({ hour }) => startOfDay(hour).getTime()),
  ).map(([timeStr, hours]) => ({
    date: new Date(+timeStr),
    hours: hours!.map(({ node }) => node),
  }));
}

export default function OutlookTable({ weather }: OutlookTableProps) {
  const rows = (() => {
    if ("properties" in weather) return <NWSOutlookRows weather={weather} />;
    return <OpenMeteoOutlookRows weather={weather} />;
  })();

  return <Rows>{rows}</Rows>;
}

function NWSOutlookRows({ weather }: { weather: NWSWeather }) {
  const days = useMemo(
    () =>
      getOutlook((hour, index) => {
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

        if (windDirection == null) return;
        if (windSpeed == null) return;
        if (windGust == null) return;
        if (temperature == null) return;

        return (
          <OutlookRow
            key={index}
            hour={hour}
            windDirection={windDirection}
            windSpeed={windSpeed}
            windGust={windGust}
            temperature={temperature}
          />
        );
      }),
    [weather],
  );

  return days.map(({ date, hours }, index) => (
    <Day key={index} date={date} hours={hours} />
  ));
}
function OpenMeteoOutlookRows({ weather }: { weather: OpenMeteoWeather }) {
  const days = useMemo(
    () =>
      getOutlook((hour, index) => {
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
          />
        );
      }),
    [weather],
  );

  return days.map(({ date, hours }, index) => (
    <Day key={index} date={date} hours={hours} />
  ));
}
