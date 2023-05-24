import styled from "@emotion/styled";
import { useAppSelector } from "../../../hooks";
import { AltitudeType, HeightUnit } from "../../../features/user/userSlice";

export const Aside = styled.aside`
  display: inline;
  opacity: 0.45;
  font-size: 0.9em;
`;

interface HeightProps {
  heightInMeters: number; // in meters
  surfaceLevelInMeters: number; // surface above MSL in meters
  heightUnitLabel: string;
  heightValueFormatter: (heightInMeters: number) => number;
}

export default function Altitude({
  heightInMeters,
  surfaceLevelInMeters,
}: Omit<HeightProps, "heightUnitLabel" | "heightValueFormatter">) {
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  const heightUnitLabel = heightUnitFormatter(heightUnit);

  const _heightValueFormatter = (heightInMeters: number) =>
    heightValueFormatter(heightInMeters, heightUnit);

  switch (altitudeType) {
    case AltitudeType.AGL:
      return AltitudeAGL({
        heightInMeters: heightInMeters,
        surfaceLevelInMeters,
        heightUnitLabel,
        heightValueFormatter: _heightValueFormatter,
      });
    case AltitudeType.MSL:
      return AltitudeMSL({
        heightInMeters,
        heightUnitLabel,
        heightValueFormatter: _heightValueFormatter,
      });
  }
}

function AltitudeAGL({
  heightInMeters,
  surfaceLevelInMeters,
  heightUnitLabel,
  heightValueFormatter,
}: HeightProps) {
  const agl = heightInMeters - surfaceLevelInMeters;

  if (!agl) return <Aside>Surface</Aside>;

  return (
    <>
      {Math.round(heightValueFormatter(agl)).toLocaleString()}{" "}
      <Aside>{heightUnitLabel}</Aside>
    </>
  );
}

function AltitudeMSL({
  heightInMeters,
  heightUnitLabel,
  heightValueFormatter,
}: Omit<HeightProps, "surfaceLevelInMeters">) {
  return (
    <>
      {Math.round(heightValueFormatter(heightInMeters)).toLocaleString()}{" "}
      <Aside>{heightUnitLabel}</Aside>
    </>
  );
}

export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function heightUnitFormatter(heightUnit: HeightUnit): string {
  switch (heightUnit) {
    case HeightUnit.Feet:
      return "ft";
    case HeightUnit.Meters:
      return "m";
  }
}

export function heightValueFormatter(
  heightInMeters: number,
  heightUnit: HeightUnit
): number {
  switch (heightUnit) {
    case HeightUnit.Feet:
      return metersToFeet(heightInMeters);
    case HeightUnit.Meters:
      return heightInMeters;
  }
}
