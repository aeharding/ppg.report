import styled from "@emotion/styled/macro";
import { useAppSelector } from "../../../hooks";
import { AltitudeType } from "../../../features/user/userSlice";

export const Aside = styled.aside`
  display: inline;
  opacity: 0.45;
  font-size: 0.9em;
`;

interface HeightProps {
  height: number; // in meters
  surfaceLevel: number; // surface above MSL in meters
}

export default function Altitude({ height, surfaceLevel }: HeightProps) {
  const altitudeType = useAppSelector((state) => state.user.altitude);

  switch (altitudeType) {
    case AltitudeType.AGL:
      return AltitudeAGL({ height, surfaceLevel });
    case AltitudeType.MSL:
      return AltitudeMSL({ height });
  }
}

function AltitudeAGL({ height, surfaceLevel }: HeightProps) {
  const agl = height - surfaceLevel;

  if (!agl) return <Aside>Surface</Aside>;

  return (
    <>
      {Math.round(metersToFeet(agl)).toLocaleString()} <Aside>ft</Aside>
    </>
  );
}

function AltitudeMSL({ height }: Pick<HeightProps, "height">) {
  return (
    <>
      {Math.round(metersToFeet(height)).toLocaleString()} <Aside>ft</Aside>
    </>
  );
}

export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}
