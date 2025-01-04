import styled from "@emotion/styled";
import { WindsAloftAltitude, WindsAloftHour } from "../../models/WindsAloft";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { css } from "@emotion/react";

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
    ) > 10;

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

function vectorDifferenceMagnitude(
  speed1: number,
  direction1: number,
  speed2: number,
  direction2: number,
): number {
  // Convert directions from degrees to radians
  const radian1 = (Math.PI / 180) * direction1;
  const radian2 = (Math.PI / 180) * direction2;

  // Convert polar coordinates to Cartesian coordinates
  const x1 = speed1 * Math.cos(radian1);
  const y1 = speed1 * Math.sin(radian1);
  const x2 = speed2 * Math.cos(radian2);
  const y2 = speed2 * Math.sin(radian2);

  // Calculate the difference in Cartesian coordinates
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate the magnitude of the difference vector
  return Math.sqrt(dx * dx + dy * dy);
}
