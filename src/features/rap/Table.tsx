import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Tippy from "@tippyjs/react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AltitudeType, toggle, toggleAltitude } from "../user/userSlice";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { headerText } from "./CinCape";
import { WindsAloftAltitude, WindsAloftHour } from "../../models/WindsAloft";

const TableEl = styled.table`
  width: 100%;
  text-align: center;
  overflow: hidden;
  table-layout: fixed;
  padding: 0 0 0 8px;

  th {
    ${headerText}
  }
`;

const Row = styled.tr<{ opaque: boolean }>`
  ${({ opaque }) =>
    opaque &&
    css`
      opacity: 0.5;
    `}
`;

const InteractTh = styled.th`
  cursor: pointer;
`;

interface TableProps {
  windsAloftHour: WindsAloftHour;
  rows: number; // number of altitudes/rows to render
  surfaceLevelMode: boolean;
}

export default function Table({
  windsAloftHour,
  rows,
  surfaceLevelMode,
}: TableProps) {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);

  const elevation = useAppSelector((state) => state.weather.elevation);

  const lowestReportedAltitude = windsAloftHour.altitudes[0].altitudeInM;

  if (typeof elevation !== "number") throw new Error("Altitude not defined!");

  // If there is a discrepancy of less than 120 meters, it's negligible
  const surfaceLevel = surfaceLevelMode ? lowestReportedAltitude : elevation;

  const displayedRapData = windsAloftHour.altitudes
    .slice(0, rows)
    .filter((datum) => !hiddenAltitude(datum));

  function hiddenAltitude(datum: WindsAloftAltitude): boolean {
    return (
      altitudeType === AltitudeType.AGL &&
      !!(datum.altitudeInM - surfaceLevel < 0)
    );
  }

  function negativeAltitude(datum: WindsAloftAltitude): boolean {
    return !!(datum.altitudeInM - surfaceLevel < 0);
  }

  return (
    <TableEl>
      <thead>
        <tr>
          <Tippy
            content={`Switch to altitude ${toggle(altitudeType)}`}
            placement="top"
            hideOnClick={false}
          >
            <InteractTh
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleAltitude());
              }}
            >
              Alt. ({altitudeType})
            </InteractTh>
          </Tippy>
          <th>Temp</th>
          <th>Direction</th>
          <th>Speed</th>
        </tr>
      </thead>

      <tbody>
        {displayedRapData.map((datum, index) => (
          <Row key={index} opaque={negativeAltitude(datum)}>
            <td>
              <Altitude
                heightInMeters={datum.altitudeInM}
                surfaceLevelInMeters={surfaceLevel}
              />
            </td>
            <td>
              <Temperature temperature={datum.temperatureInC} />
            </td>
            <td>
              <WindDirection
                curr={datum.windDirectionInDeg}
                prev={displayedRapData[index - 1]?.windDirectionInDeg}
              />
            </td>
            <td>
              <WindSpeed
                curr={datum.windSpeedInKph}
                prev={displayedRapData[index - 1]?.windSpeedInKph}
              />
            </td>
          </Row>
        ))}
      </tbody>
    </TableEl>
  );
}
