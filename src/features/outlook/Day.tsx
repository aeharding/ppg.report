import styled from "@emotion/styled";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../weather/weatherSlice";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

const Table = styled.table`
  width: 100%;

  padding: 0;
  border-collapse: collapse;
  border: none;

  text-align: center;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  transform: translateY(-0.5px);
  z-index: 1;
  background: var(--bg-bottom-sheet);
`;

const DayLabelCell = styled.th`
  text-align: start;
  padding: 8px 16px;
`;

interface DayProps {
  date: Date;
  hours: React.ReactNode[];
}

export default function Day({ hours, date }: DayProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone needed");

  return (
    <Table>
      <THead>
        <tr>
          <DayLabelCell>
            {format(new TZDate(date, timeZone), "eeee, LLL d")}
          </DayLabelCell>
        </tr>
      </THead>
      <tbody>{hours}</tbody>
    </Table>
  );
}
