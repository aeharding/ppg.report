import styled from "@emotion/styled";
import { WindsAloftAltitude, WindsAloftHour } from "../../models/WindsAloft";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { css } from "@emotion/react";
import { vectorDifferenceMagnitude } from "../../helpers/vector";

const DELTA_WINDSPEED_VECTOR_THRESHOLD_KPH = 10;

const TableRow = styled.tr<{ opaque: boolean }>`
  ${({ opaque }) =>
    opaque &&
    css`
      opacity: 0.5;
    `}
`;

interface RowProps {
  datum: WindsAloftAltitude;
  index: number;
  displayedRapData: WindsAloftAltitude[];
  surfaceLevel: number;
  windsAloftHour: WindsAloftHour;
}

export default function Row({
  datum,
  index,
  displayedRapData,
  surfaceLevel,
  windsAloftHour,
}: RowProps) {
  function negativeAltitude(datum: WindsAloftAltitude): boolean {
    return !!(datum.altitudeInM - surfaceLevel < 0);
  }

  const shearEligible =
    displayedRapData[index - 1] &&
    vectorDifferenceMagnitude(
      datum.windSpeedInKph,
      datum.windDirectionInDeg,
      displayedRapData[index - 1]?.windSpeedInKph,
      displayedRapData[index - 1]?.windDirectionInDeg,
    ) > DELTA_WINDSPEED_VECTOR_THRESHOLD_KPH;

  return (
    <TableRow key={index} opaque={negativeAltitude(datum)}>
      <td>
        <Altitude
          heightInMeters={datum.altitudeInM}
          surfaceLevelInMeters={surfaceLevel}
          pressure={datum.pressure}
        />
      </td>
      <td>
        <Temperature
          temperature={datum.temperatureInC}
          dewpoint={datum.dewpointInC}
          lapseRate={
            displayedRapData[index - 1]
              ? -(
                  (datum.temperatureInC -
                    displayedRapData[index - 1].temperatureInC) /
                  (datum.altitudeInM - displayedRapData[index - 1].altitudeInM)
                )
              : undefined
          }
          pressure={datum.pressure}
          hour={new Date(windsAloftHour.date)}
        />
      </td>
      <td>
        <WindDirection
          curr={datum.windDirectionInDeg}
          prev={displayedRapData[index - 1]?.windDirectionInDeg}
          shearEligible={shearEligible}
        />
      </td>
      <td>
        <WindSpeed
          curr={datum.windSpeedInKph}
          prev={displayedRapData[index - 1]?.windSpeedInKph}
        />
      </td>
    </TableRow>
  );
}
