import styled from "@emotion/styled";
import { formatWind } from "../../helpers/taf";
import { useAppSelector } from "../../hooks";
import { SpeedUnit } from "metar-taf-parser";

const Speed = styled.div`
  word-spacing: -2px;
`;
const Gust = styled.div`
  font-size: 12px;
  word-spacing: -2px;
`;

interface WindSpeedProps {
  speed: number;
  gust: number;
}

export default function WindSpeed({ speed, gust }: WindSpeedProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const speedFormatted = formatWind(
    speed,
    SpeedUnit.KilometersPerHour,
    speedUnit,
  );
  const gustFormatted = formatWind(
    gust,
    SpeedUnit.KilometersPerHour,
    speedUnit,
  );

  return (
    <>
      <Speed>{speedFormatted}</Speed>
      <Gust>max {gustFormatted}</Gust>
    </>
  );
}
