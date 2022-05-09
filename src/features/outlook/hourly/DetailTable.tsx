import styled from "@emotion/styled/macro";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import React, { useMemo } from "react";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../../weather/weatherSlice";
import GustCell from "./GustCell";
import { TableData } from "./Hourly";
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

  td {
    border: 1px solid rgba(255, 255, 255, 0.1);

    // If changed, calculations must be adjusted
    min-width: 2rem;
  }
`;

const DayCell = styled.td`
  padding: 0 1rem;
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
            {dayCells.map(({ date, colSpan }) => (
              <DayCell colSpan={colSpan} key={date.getTime()}>
                <StickyCellContents>
                  {formatInTimeZone(date, timeZone, "iiii, LLLL do")}
                </StickyCellContents>
              </DayCell>
            ))}
          </tr>
          <tr>
            <td>Time</td>
            {tableData.map(({ date }) => (
              <td key={date.getTime()}>
                {formatInTimeZone(date, timeZone, "haaaaa")}
              </td>
            ))}
          </tr>
          <tr>
            <td>Wind</td>
            {tableData.map(({ date, windSpeed, windDirection }, index) => (
              <td key={date.getTime()}>
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
            {tableData.map(({ date, windGust }) => (
              <td key={date.getTime()}>
                {windGust ? <GustCell windGust={windGust.value} /> : ""}
              </td>
            ))}
          </tr>
          <tr>
            <td>Temp</td>
            {tableData.map(({ date, temperature }) => (
              <td key={date.getTime()}>
                {temperature ? (
                  <TempCell temperature={temperature.value} />
                ) : (
                  ""
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </OutlookContainer>
  );
}
