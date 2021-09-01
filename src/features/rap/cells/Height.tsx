import styled from "@emotion/styled/macro";

export const Aside = styled.aside`
  display: inline;
  opacity: 0.3;
`;

interface HeightProps {
  height: number; // in meters
  surfaceLevel: number; // surface above MSL in meters
}

export default function Height({ height, surfaceLevel }: HeightProps) {
  const agl = height - surfaceLevel;

  if (!agl) return <Aside>Surface</Aside>;

  return (
    <>
      {Math.round(metersToFeet(agl)).toLocaleString()} <Aside>ft</Aside>
    </>
  );
}

function metersToFeet(meters: number): number {
  return meters * 3.28084;
}
