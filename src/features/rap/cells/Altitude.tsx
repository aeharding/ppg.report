import styled from "@emotion/styled";
import { useAppSelector } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { AltitudeType, HeightUnit } from "../extra/settings/settingEnums";

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
  pressure: number | undefined;
}

export default function Altitude({
  heightInMeters,
  surfaceLevelInMeters,
  pressure,
}: Omit<HeightProps, "heightUnitLabel" | "heightValueFormatter">) {
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  const heightUnitLabel = heightUnitFormatter(heightUnit);

  const _heightValueFormatter = (heightInMeters: number) =>
    heightValueFormatter(heightInMeters, heightUnit);

  switch (altitudeType) {
    case AltitudeType.AGL:
      return (
        <AltitudeAGL
          heightInMeters={heightInMeters}
          surfaceLevelInMeters={surfaceLevelInMeters}
          heightUnitLabel={heightUnitLabel}
          heightValueFormatter={_heightValueFormatter}
        />
      );
    case AltitudeType.MSL:
      return (
        <AltitudeMSL
          heightInMeters={heightInMeters}
          heightUnitLabel={heightUnitLabel}
          heightValueFormatter={_heightValueFormatter}
        />
      );
    case AltitudeType.Pressure:
      return <Pressure pressure={pressure} />;
  }
}

function Pressure({ pressure }: Pick<HeightProps, "pressure">) {
  return (
    <>
      {pressure} <Aside>mb</Aside>
    </>
  );
}

function AltitudeAGL({
  heightInMeters,
  surfaceLevelInMeters,
  heightUnitLabel,
  heightValueFormatter,
}: Omit<HeightProps, "pressure">) {
  const { t } = useTranslation();
  const agl = heightInMeters - surfaceLevelInMeters;

  if (!agl) return <Aside>{t("Surface")}</Aside>;

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
}: Omit<HeightProps, "surfaceLevelInMeters" | "pressure">) {
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
  heightUnit: HeightUnit,
): number {
  switch (heightUnit) {
    case HeightUnit.Feet:
      return metersToFeet(heightInMeters);
    case HeightUnit.Meters:
      return heightInMeters;
  }
}
