import styled from "@emotion/styled";
import chroma from "chroma-js";
import {
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "../../../helpers/colors";
import { Aside } from "./Altitude";
import { useAppSelector } from "../../../hooks";
import { cToF, fToC } from "../../weather/aviation/DetailedAviationReport";
import { OnOff, TemperatureUnit } from "../extra/settings/settingEnums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowToTop,
  faArrowUp,
  faDewpoint,
} from "@fortawesome/pro-light-svg-icons";
import * as velitherm from "velitherm";
import TemperatureTooltip from "./tooltips/temperature/TemperatureTooltip";
import LapseRateTooltip from "./tooltips/lapseRate/LapseRateTooltip";

const TemperatureContainer = styled.div`
  position: relative;
`;

const DropletIcon = styled(FontAwesomeIcon)<{ opacity: number }>`
  font-size: 0.8em;

  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);

  ${({ opacity }) =>
    outputP3ColorFromRGBA(
      opacity === 1 ? [0, 145, 255, 1] : [255, 255, 255, 0.4]
    )}
  opacity: ${({ opacity }) => opacity};
  filter: ${({ opacity }) => (opacity >= 1 ? "blur(0)" : "blur(1px)")};
`;

const AirStabilityContainer = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  bottom: -50%;
  transform: translate(50%, -100%);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const AirStabilityIconContainer = styled.div`
  width: 30px;
  height: 30px;
  font-size: 0.8em;
`;

const LapseDangerIcon = styled(FontAwesomeIcon)<{
  type: "danger" | "warning";
}>`
  ${({ type }) => {
    switch (type) {
      case "danger":
        return outputP3ColorFromRGB([255, 0, 0]);
      case "warning":
        return outputP3ColorFromRGBA([255, 255, 255, 0.15]);
    }
  }}
`;

const InversionIcon = styled(FontAwesomeIcon)`
  ${() => outputP3ColorFromRGB([0, 255, 0])}
`;

const colorScale = chroma
  .scale(["rgb(176, 38, 255)", "#0084ff", "#00ff00", "yellow", "red"])
  .domain([-5, 32, 60, 86, 95].map(fToC));

export const TemperatureText = styled.div<{ temperature: number }>`
  ${({ temperature }) => outputP3ColorFromRGB(colorScale(temperature).rgb())}
`;

interface TemperatureProps {
  temperature: number; // Celsius
  dewpoint: number;
  lapseRate: number | undefined; // ℃/m
  pressure: number;
  hour: Date;
}

export default function Temperature({
  temperature: inCelsius,
  dewpoint,
  lapseRate,
  pressure,
  hour,
}: TemperatureProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);
  const lapseRateEnabled =
    useAppSelector((state) => state.user.lapseRate) === OnOff.On;

  const temperature = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return inCelsius;
      case TemperatureUnit.Fahrenheit:
        return cToF(inCelsius);
    }
  })();

  const temperatureUnitLabel = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "C";
      case TemperatureUnit.Fahrenheit:
        return "F";
    }
  })();

  const saturated = dewpoint != null ? inCelsius - dewpoint <= 0 : false;
  const saturatedLapseRateThreshold = velitherm.gammaMoist(inCelsius, pressure);

  function renderAirStabilityIcon() {
    if (!lapseRate) return;

    if (lapseRate <= 0) {
      return <InversionIcon icon={faArrowToTop} />;
    }

    if (lapseRate >= velitherm.gamma) {
      return <LapseDangerIcon icon={faArrowUp} type="danger" />;
    }

    if (
      saturatedLapseRateThreshold &&
      lapseRate >= saturatedLapseRateThreshold
    ) {
      if (!saturated)
        return <LapseDangerIcon icon={faArrowUp} type="warning" />;

      return <LapseDangerIcon icon={faArrowUp} type="danger" />;
    }
  }

  const airStabilityIcon = renderAirStabilityIcon();

  return (
    <TemperatureContainer>
      <TemperatureTooltip dewpoint={dewpoint} temperature={inCelsius}>
        <TemperatureText temperature={inCelsius}>
          {Math.round(temperature)} <Aside>°{temperatureUnitLabel}</Aside>{" "}
        </TemperatureText>
        {lapseRate &&
        dewpoint != null &&
        inCelsius - dewpoint <= 2.5 &&
        inCelsius > 0 ? (
          <DropletIcon
            icon={faDewpoint}
            opacity={1 - scaleValue(inCelsius - dewpoint, 0, 1.5)}
          />
        ) : (
          ""
        )}
      </TemperatureTooltip>
      {lapseRateEnabled && (
        <AirStabilityContainer>
          {airStabilityIcon ? (
            <LapseRateTooltip
              lapseRate={lapseRate!}
              saturatedLapseRateThreshold={saturatedLapseRateThreshold}
              saturated={saturated}
              hour={hour}
            >
              <AirStabilityIconContainer>
                {airStabilityIcon}
              </AirStabilityIconContainer>
            </LapseRateTooltip>
          ) : undefined}
        </AirStabilityContainer>
      )}
    </TemperatureContainer>
  );
}

function scaleValue(value: number, min: number, max: number): number {
  if (value <= min) {
    return 0;
  } else if (value >= max) {
    return 1;
  } else {
    return (value - min) / (max - min);
  }
}
