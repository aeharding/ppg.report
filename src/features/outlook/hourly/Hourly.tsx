import styled from "@emotion/styled/macro";
import { eachHourOfInterval } from "date-fns";
import { useMemo } from "react";
import { useAppSelector } from "../../../hooks";
import { findValue, getInterval } from "../../../services/weather";
import {
  currentWeather,
  Value,
  WeatherObservation,
} from "../../weather/weatherSlice";
import DetailTable from "./DetailTable";
import ScrollController from "./ScrollController";
import SummaryTable from "./SummaryTable";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 4rem;

  margin-bottom: 1rem;
`;

export type TableData = {
  date: Date;
  windSpeed: Value<number> | undefined;
  windGust: Value<number> | undefined;
  windDirection: Value<number> | undefined;
  temperature: Value<number> | undefined;
  weather: Value<WeatherObservation[]> | undefined;
}[];

export default function Hourly() {
  const weather = useAppSelector(currentWeather);

  const tableData: TableData = useMemo(() => {
    switch (weather) {
      case "pending":
      case "failed":
      case undefined:
        return [];
      default:
        return eachHourOfInterval(
          getInterval(weather.properties.validTimes)
        ).map((date) => {
          return {
            date,
            windSpeed: findValue(date, weather.properties.windSpeed),
            windGust: findValue(date, weather.properties.windGust),
            windDirection: findValue(date, weather.properties.windDirection),
            temperature: findValue(date, weather.properties.temperature),
            weather: findValue(date, weather.properties.weather),
          };
        });
    }
  }, [weather]);

  function selectDate(date: Date) {
    const index = tableData.findIndex(
      (d) => date.getTime() === d.date.getTime()
    );

    if (index === -1) return;

    const detailTableEl = document.getElementById("detail-table");

    if (!detailTableEl) return;

    detailTableEl.scrollLeft = (index - window.innerWidth / 64) * 32;
  }

  return (
    <Container>
      <SummaryTable tableData={tableData} selectDate={selectDate} />
      <DetailTable tableData={tableData} />
      <ScrollController />
    </Container>
  );
}

export function toMph(speed: number): number {
  return speed * 0.621371;
}
