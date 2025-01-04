import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { headerText } from "./CinCape";
import { WindsAloftAltitude, WindsAloftHour } from "../../models/WindsAloft";
import {
  findNormalizedAltitude,
  findNormalizedPressure,
} from "../../helpers/interpolate";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import {
  AltitudeLevels,
  AltitudeType,
  HeightUnit,
} from "./extra/settings/settingEnums";
import { toggleAltitude } from "../user/userSlice";
import { toggleAltitudeType } from "../../helpers/locale";
import { notEmpty } from "../../helpers/array";
import Tooltip from "../../shared/Tooltip";
import Row from "./Row";

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

const NORMALIZED_PRESSURE_MB = [
  1000, 975, 950, 925, 900, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400,
  350, 300, 250,
];

export default function Table({
  windsAloftHour,
  rows,
  surfaceLevelMode,
}: TableProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const altitudeLevels = useAppSelector((state) => state.user.altitudeLevels);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  const elevation = useAppSelector((state) => state.weather.elevation);

  const lowestReportedAltitude = windsAloftHour.altitudes[0].altitudeInM;

  if (typeof elevation !== "number") throw new Error("Altitude not defined!");

  // If there is a discrepancy of less than 120 meters, it's negligible
  const surfaceLevel = surfaceLevelMode ? lowestReportedAltitude : elevation;

  const hiddenAltitude = useCallback(
    (datum: WindsAloftAltitude) => {
      return (
        altitudeType === AltitudeType.AGL &&
        !!(datum.altitudeInM - surfaceLevel < 0)
      );
    },
    [altitudeType, surfaceLevel],
  );

  const displayedRapData: WindsAloftAltitude[] = useMemo(() => {
    if (altitudeType === AltitudeType.Pressure) {
      const filteredPressures = windsAloftHour.altitudes.filter(
        (alt) => alt.pressure != null && alt.pressure >= 250,
      );

      switch (altitudeLevels) {
        case AltitudeLevels.Default:
          return filteredPressures;
        case AltitudeLevels.Normalized:
          return NORMALIZED_PRESSURE_MB.map((pressure) =>
            findNormalizedPressure(pressure, filteredPressures),
          ).filter(notEmpty);
      }
    }

    switch (altitudeLevels) {
      case AltitudeLevels.Default:
        return windsAloftHour.altitudes
          .slice(0, rows)
          .filter((datum) => !hiddenAltitude(datum));

      case AltitudeLevels.Normalized: {
        const NORMALIZED_ALTITUDES = (() => {
          switch (heightUnit) {
            case HeightUnit.Feet:
              return NORMALIZED_ALTITUDES_AGL_FT;
            case HeightUnit.Meters:
              return NORMALIZED_ALTITUDES_AGL_M;
          }
        })();

        return NORMALIZED_ALTITUDES.map((altitude) =>
          findNormalizedAltitude(
            altitude + surfaceLevel,
            windsAloftHour.altitudes,
          ),
        ).filter(notEmpty);
      }
    }
  }, [
    altitudeType,
    altitudeLevels,
    windsAloftHour.altitudes,
    rows,
    hiddenAltitude,
    heightUnit,
    surfaceLevel,
  ]);

  return (
    <TableEl>
      <thead>
        <tr>
          <Tooltip
            contents={() =>
              `Switch to altitude ${toggleAltitudeType(altitudeType)}`
            }
          >
            <InteractTh
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleAltitude());
              }}
            >
              {altitudeType === AltitudeType.Pressure ? (
                <>Pressure</>
              ) : (
                <>Alt. ({altitudeType})</>
              )}
            </InteractTh>
          </Tooltip>
          <th>{t("Temp")}</th>
          <th>{t("Direction")}</th>
          <th>{t("Speed")}</th>
        </tr>
      </thead>

      <tbody>
        {displayedRapData.map((datum, index) => (
          <Row
            key={index}
            datum={datum}
            index={index}
            surfaceLevel={surfaceLevel}
            windsAloftHour={windsAloftHour}
            displayedRapData={displayedRapData}
          />
        ))}
      </tbody>
    </TableEl>
  );
}
