import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Tippy from "@tippyjs/react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  AltitudeLevels,
  AltitudeType,
  HeightUnit,
  toggle,
  toggleAltitude,
} from "../user/userSlice";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { headerText } from "./CinCape";
import { WindsAloftAltitude, WindsAloftHour } from "../../models/WindsAloft";
import { findNormalizedAltitude } from "../../helpers/wind";
import uniqBy from "lodash/uniqBy";

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

const NORMALIZED_ALTITUDES_AGL_FT = [
  0, 100, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000,
  8000, 9000, 10000, 11000, 12000, 13000, 14000,
].map((ft) => ft * 0.3048);

const NORMALIZED_ALTITUDES_AGL_M = [
  0, 30, 75, 150, 225, 300, 450, 600, 750, 900, 1200, 1500, 1800, 2100, 2400,
  2700, 3000, 3300, 3600, 3900, 4200,
];

export default function Table({
  windsAloftHour,
  rows,
  surfaceLevelMode,
}: TableProps) {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const altitudeLevels = useAppSelector((state) => state.user.altitudeLevels);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  const elevation = useAppSelector((state) => state.weather.elevation);

  const lowestReportedAltitude = windsAloftHour.altitudes[0].altitudeInM;

  if (typeof elevation !== "number") throw new Error("Altitude not defined!");

  // If there is a discrepancy of less than 120 meters, it's negligible
  const surfaceLevel = surfaceLevelMode ? lowestReportedAltitude : elevation;

  let displayedRapData: WindsAloftAltitude[];

  if (altitudeLevels === AltitudeLevels.Default) {
    displayedRapData = windsAloftHour.altitudes
      .slice(0, rows)
      .filter((datum) => !hiddenAltitude(datum));

    function hiddenAltitude(datum: WindsAloftAltitude): boolean {
      return (
        altitudeType === AltitudeType.AGL &&
        !!(datum.altitudeInM - surfaceLevel < 0)
      );
    }
  } else {
    const NORMALIZED_ALTITUDES = (() => {
      switch (heightUnit) {
        case HeightUnit.Feet:
          return NORMALIZED_ALTITUDES_AGL_FT;
        case HeightUnit.Meters:
          return NORMALIZED_ALTITUDES_AGL_M;
      }
    })();

    displayedRapData = uniqBy(
      NORMALIZED_ALTITUDES.map((altitude) =>
        findNormalizedAltitude(
          altitude + surfaceLevel,
          windsAloftHour.altitudes
        )
      ),
      (alt) => alt.altitudeInM
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
