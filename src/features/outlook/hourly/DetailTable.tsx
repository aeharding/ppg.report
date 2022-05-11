import styled from "@emotion/styled/macro";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import React, { useMemo } from "react";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../../weather/weatherSlice";
import GustCell from "./GustCell";
import { TableData } from "./Hourly";
import WeatherCell from "./WeatherCell";
import TempCell from "./TempCell";
import WindCell from "./WindCell";

const OutlookContainer = styled.div`
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Table = styled.table`
  border-collapse: collapse;
  text-align: center;
  overflow: hidden;

  td {
    border: 1px solid rgba(255, 255, 255, 0.1);

    // If changed, calculations must be adjusted
    min-width: 2rem;
  }
`;

const DayCell = styled.td`
  padding: 0 1rem;

  position: relative;

  &:after {
    content: "";
    position: absolute;
    right: -1.25px;
    top: -1px;
    height: 200px;
    border-right: 1px dashed rgba(255, 255, 255, 0.6);

    mask: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgb(0, 0, 0) 10%,
      rgb(0, 0, 0) 90%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

const StickyCellContents = styled.div`
  display: inline-block;
  position: sticky;
  left: var(--left-safe-area);
  right: var(--right-safe-area);
`;

interface DetailTableProps {
  tableData: TableData;
}

export default function DetailTable({ tableData }: DetailTableProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone not defined");

  const dayCells = useMemo(
    () =>
      tableData.reduce<{ date: Date; colSpan: number }[]>((data, { date }) => {
        if (!data.length)
          return [
            {
              date,
              colSpan: 1,
            },
          ];

        const final = data[data.length - 1];
        if (
          utcToZonedTime(final.date, timeZone).getDate() ===
          utcToZonedTime(date, timeZone).getDate()
        ) {
          final.colSpan += 1;
          return data;
        }

        return [...data, { date, colSpan: 1 }];
      }, []),
    [tableData, timeZone]
  );

  return (
    <OutlookContainer id="detail-table">
      <Table>
        <tbody>
          <tr>
            <td>Day</td>
            {dayCells.map(({ date, colSpan }, index) => (
              <DayCell colSpan={colSpan} key={index}>
                <StickyCellContents>
                  {formatInTimeZone(date, timeZone, "iiii, LLLL do")}
                </StickyCellContents>
              </DayCell>
            ))}
          </tr>
          <tr>
            <td>Time</td>
            {tableData.map(({ date }, index) => (
              <td key={index}>{formatInTimeZone(date, timeZone, "haaaaa")}</td>
            ))}
          </tr>
          <tr>
            <td>Wind (mph)</td>
            {tableData.map(({ windSpeed, windDirection }, index) => (
              <td key={index}>
                {windSpeed ? (
                  <WindCell
                    windSpeed={windSpeed.value}
                    direction={windDirection?.value}
                  />
                ) : (
                  ""
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>Gust</td>
            {tableData.map(({ windGust }, index) => (
              <td key={index}>
                {windGust ? <GustCell windGust={windGust.value} /> : ""}
              </td>
            ))}
          </tr>
          <tr>
            <td>°F</td>
            {tableData.map(({ temperature }, index) => (
              <td key={index}>
                {temperature ? (
                  <TempCell temperature={temperature.value} />
                ) : (
                  ""
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>Wx</td>
            {tableData.map(({ weather }, index) => (
              <td key={index}>
                {weather ? <WeatherCell weather={weather.value} /> : ""}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </OutlookContainer>
  );
}
