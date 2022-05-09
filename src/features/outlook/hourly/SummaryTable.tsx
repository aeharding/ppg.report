import styled from "@emotion/styled/macro";
import Tippy from "@tippyjs/react";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { useMemo } from "react";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../../weather/weatherSlice";
import { TableData } from "./Hourly";
import MiniWindCell from "./MiniWindCell";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  margin-top: 1rem;
`;

const Highlight = styled.div`
  position: absolute;
  top: 0.75rem;
  height: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-top: none;
  border-bottom: none;

  background: rgba(255, 255, 255, 0.08);

  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  position: relative;

  tr {
    height: 4rem;
  }

  td {
    padding: 0;
  }
`;

const WindRow = styled.tr`
  filter: blur(2px);
`;

const WindCell = styled.td<{ date: Date }>`
  height: 1rem;
`;

const Day = styled.div<{ offset: number; width: number }>`
  left: ${({ offset }) => offset}px;
  width: ${({ width }) => width}px;
  text-align: center;
  position: absolute;
  bottom: 3.75rem;
  font-size: 0.8em;

  span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3rem;
    height: 3.75rem;
    border-left: 1px dashed rgba(255, 255, 255, 0.3);
  }
`;

interface SummaryTableProps {
  tableData: TableData;
  selectDate: (date: Date) => void;
}

export default function SummaryTable({
  tableData,
  selectDate,
}: SummaryTableProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone not defined");

  const { width } = useWindowSize();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dateFormat = isMobile ? "eee" : "eee, MMM do";

  const days = useMemo(
    () =>
      tableData
        .reduce<{ date: Date; offset: number; span: number }[]>(
          (data, { date }, index) => {
            if (!data.length)
              return [
                {
                  date,
                  offset: index,
                  span: 1,
                },
              ];

            const final = data[data.length - 1];
            if (
              utcToZonedTime(final.date, timeZone).getDate() ===
              utcToZonedTime(date, timeZone).getDate()
            ) {
              final.span += 1;
              return data;
            }

            return [...data, { date, span: 1, offset: index }];
          },
          []
        )
        .map(({ date, offset, span }) => ({
          date,
          offset: offset * (width / tableData.length),
          width: span * (width / tableData.length),
        })),
    [tableData, width, timeZone]
  );

  return (
    <Container>
      <Table id="summary-table">
        <tbody>
          <WindRow>
            {tableData.map(({ date, windSpeed }, index) => (
              <WindCell
                date={date}
                onClick={() => selectDate(date)}
                key={index}
              >
                {windSpeed ? <MiniWindCell windSpeed={windSpeed.value} /> : ""}
              </WindCell>
            ))}
          </WindRow>
        </tbody>
      </Table>

      {days.map(({ date, offset, width }, index) => (
        <Day offset={offset} width={width} key={index}>
          <Tippy
            content={formatInTimeZone(date, timeZone, "EEEE, MMM do yyyy")}
          >
            <span>{formatInTimeZone(date, timeZone, dateFormat)}</span>
          </Tippy>
        </Day>
      ))}

      <Highlight id="summary-table-highlight" />
    </Container>
  );
}
