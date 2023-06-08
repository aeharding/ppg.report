import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Aside } from "./Altitude";
import chroma from "chroma-js";
import { shearIndicator } from "./WindDirection";
import {
  outputJustP3ColorFromLab,
  outputP3ColorFromLab,
} from "../../../helpers/colors";
import { useMemo } from "react";
import { useAppSelector } from "../../../hooks";
import { SpeedUnit } from "../extra/settings/settingEnums";

const colorScale = chroma
  .scale([
    "#00FF00",
    "#00FF00",
    "white",
    "white",
    "orange",
    "red",
    "red",
    "#FF10F0",
    "#AD2AFF",
    "white",
  ])
  .domain([0, 5.56, 17.59, 18.52, 25.93, 55.56, 64.82, 138.9, 185.2, 296.32])
  .mode("lab");

const WindSpeedContainer = styled.div<{
  speed: number;
  shear: boolean;
}>`
  position: relative;

  ${({ speed }) => outputP3ColorFromLab(colorScale(speed).lab())};
  background-color: ${({ theme }) => (theme ? "currentColor" : "transparent")};

  ${({ shear }) =>
    shear &&
    css`
      &:after {
        ${shearIndicator}
      }
    `}

  tr:first-of-type & {
    border-top-left-radius: 5px;
  }

  tr:last-of-type & {
    border-bottom-left-radius: 5px;
  }
`;

const Text = styled.div<{ speed: number }>`
  color: ${({ theme }) => (theme ? "var(--text)" : "currentColor")};
  color: color-contrast(
    ${({ speed }) => outputJustP3ColorFromLab(colorScale(speed).lab())} vs #fff,
    #aaa,
    #000
  );
`;

interface WindSpeedProps {
  // todo: check wind units provided on rap
  curr: number; // in kph
  prev?: number;
}

export default function WindSpeed({ curr, prev }: WindSpeedProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);

  const content = useMemo(() => {
    const formattedWindSpeed = (() => {
      switch (speedUnit) {
        case SpeedUnit.Knots:
          return curr * 0.539957;
        case SpeedUnit.MPH:
          return curr * 0.621371;
        case SpeedUnit.KPH:
          return curr;
        case SpeedUnit.mps:
          return curr * 0.277778;
      }
    })();

    const speedUnitLabel = speedUnitFormatter(speedUnit);

    return (
      <WindSpeedContainer
        speed={curr}
        shear={Math.abs(curr - (prev === undefined ? curr : prev)) > 15}
      >
        <Text speed={curr}>
          {Math.round(formattedWindSpeed)} <Aside>{speedUnitLabel}</Aside>
        </Text>
      </WindSpeedContainer>
    );
  }, [curr, prev, speedUnit]);

  return content;
}

export function speedUnitFormatter(speedUnit: SpeedUnit): string {
  switch (speedUnit) {
    case SpeedUnit.KPH:
      return "km/h";
    case SpeedUnit.MPH:
      return "mph";
    case SpeedUnit.Knots:
      return "kt";
    case SpeedUnit.mps:
      return "m/s";
  }
}
