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
import { endOfDay, isPast, isToday } from "date-fns";
import { css } from "@emotion/react/macro";

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
  display: inline-flex;
  align-items: center;
  justify-content: center;

  position: sticky;
  left: var(--left-safe-area);
  right: var(--right-safe-area);
`;

const Today = styled.span`
  font-size: 0.6em;
  font-weight: 800;
  background: #00ff00;
  color: black;
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 0.5em;

  &:after {
    content: "TODAY";
  }
`;

const Hour = styled.div<{ isPast: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ isPast }) =>
    isPast
      ? css`
          opacity: 0.4;
        `
      : ""}
`;

const HourCell = styled.td<{ isPast: boolean }>`
  ${({ isPast }) =>
    isPast
      ? css`
          opacity: 0.4;
        `
      : ""}
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
                  <Hour isPast={isPast(endOfDay(date))}>
                    {formatInTimeZone(date, timeZone, "iiii, LLLL do")}{" "}
                    {isToday(date) ? <Today /> : ""}
                  </Hour>
                </StickyCellContents>
              </DayCell>
            ))}
          </tr>
          <tr>
            <td>Time</td>
            {tableData.map(({ date }, index) => (
              <HourCell isPast={isPast(date)} key={index}>
                {formatInTimeZone(date, timeZone, "haaaaa")}
              </HourCell>
            ))}
          </tr>
          <tr>
            <td>Wind (mph)</td>
            {tableData.map(({ windSpeed, windDirection, date }, index) => (
              <HourCell isPast={isPast(date)} key={index}>
                {windSpeed ? (
                  <WindCell
                    windSpeed={windSpeed.value}
                    direction={windDirection?.value}
                  />
                ) : (
                  ""
                )}
              </HourCell>
            ))}
          </tr>
          <tr>
            <td>Gust</td>
            {tableData.map(({ windGust, date }, index) => (
              <HourCell isPast={isPast(date)} key={index}>
                {windGust ? <GustCell windGust={windGust.value} /> : ""}
              </HourCell>
            ))}
          </tr>
          <tr>
            <td>°F</td>
            {tableData.map(({ temperature, date }, index) => (
              <HourCell isPast={isPast(date)} key={index}>
                {temperature ? (
                  <TempCell temperature={temperature.value} />
                ) : (
                  ""
                )}
              </HourCell>
            ))}
          </tr>
          <tr>
            <td>Wx</td>
            {tableData.map(({ weather, date }, index) => (
              <HourCell isPast={isPast(date)} key={index}>
                {weather ? <WeatherCell weather={weather.value} /> : ""}
              </HourCell>
            ))}
          </tr>
        </tbody>
      </Table>
    </OutlookContainer>
  );
}
