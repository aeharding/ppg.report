import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import Tippy from "@tippyjs/react";
import { Rap, RapDatum } from "gsl-parser";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AltitudeType, toggle, toggleAltitude } from "../user/userSlice";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { headerText } from "./CinCape";
import { ELEVATION_DISCREPANCY_THRESHOLD } from "./ReportElevationDiscrepancy";

const TableEl = styled.table`
  width: 100%;
  text-align: center;
  overflow: hidden;

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
  rap: Rap;
  rows: number; // number of altitudes/rows to render
}

export default function Table({ rap, rows }: TableProps) {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const elevation = useAppSelector((state) => state.weather.elevation);

  const lowestReportedAltitude = rap.data[0].height;

  if (!elevation) throw new Error("Altitude not defined!");

  // If there is a discrepancy of less than 120 meters, it's negligible
  const surfaceLevel =
    Math.abs(elevation - lowestReportedAltitude) <
    ELEVATION_DISCREPANCY_THRESHOLD
      ? lowestReportedAltitude
      : elevation;

  const displayedRapData = rap.data
    .slice(0, rows)
    .filter((datum) => !hiddenAltitude(datum));

  function hiddenAltitude(datum: RapDatum): boolean {
    return (
      altitudeType === AltitudeType.AGL && !!(datum.height - surfaceLevel < 0)
    );
  }

  function negativeAltitude(datum: RapDatum): boolean {
    return !!(datum.height - surfaceLevel < 0);
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
            <InteractTh onClick={() => dispatch(toggleAltitude())}>
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
              <Altitude height={datum.height} surfaceLevel={surfaceLevel} />
            </td>
            <td>
              <Temperature temperature={datum.temp} />
            </td>
            <td>
              <WindDirection
                curr={datum.windDir}
                prev={displayedRapData[index - 1]?.windDir}
              />
            </td>
            <td>
              <WindSpeed
                curr={datum.windSpd}
                prev={displayedRapData[index - 1]?.windSpd}
              />
            </td>
          </Row>
        ))}
      </tbody>
    </TableEl>
  );
}
