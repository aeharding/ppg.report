import styled from "@emotion/styled";
import Tooltip from "../../../../../shared/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/pro-duotone-svg-icons";
import { css } from "@emotion/react";
import { outputP3ColorFromRGB } from "../../../../../helpers/colors";
import { useState } from "react";
import SunCalc from "suncalc";
import { useParams } from "react-router-dom";
import * as velitherm from "velitherm";
import { useAppSelector } from "../../../../../hooks";
import { renderLapseRate } from "../../../../../helpers/lapseRate";

const About = styled.div`
  margin-top: 1rem;
`;

const Moist = styled.strong`
  color: #0095ff;
`;

interface LapseRateTooltipProps {
  lapseRate: number;
  saturatedLapseRateThreshold: number;
  saturated: boolean;
  hour: Date;

  children?: React.ReactNode;
}

export default function LapseRateTooltip({
  lapseRate,
  saturatedLapseRateThreshold,
  saturated,
  hour,

  children,
}: LapseRateTooltipProps) {
  const { location } = useParams<"location">();
  const [lat, lon] = location!.split(",");
  const [times] = useState(SunCalc.getPosition(hour, +lat, +lon));
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const isDay = times.altitude > 0;

  function renderExplanation() {
    if (lapseRate < 0) {
      if (!isDay) {
        return (
          <>
            <strong>Nocturnal temperature inversions</strong> indicate calm
            conditions, but quickly erode after sunrise.
          </>
        );
      }

      return (
        <>
          Indicates an <strong>inversion</strong>.<br />
          Usually calm, sometimes fog.
        </>
      );
    }

    if (lapseRate > saturatedLapseRateThreshold && saturated) {
      return (
        <>
          Unstable air. Greater than the{" "}
          <strong>
            <Moist>moist adiabatic lapse rate</Moist>
          </strong>{" "}
          of{" "}
          {renderLapseRate(
            saturatedLapseRateThreshold,
            temperatureUnit,
            heightUnit
          )}
          ,
          <br />
          with a{" "}
          <strong>
            saturated atmosphere
            <br />
            (RH ≥ 100%)
          </strong>{" "}
          for this height.
        </>
      );
    }

    if (lapseRate > velitherm.gamma)
      return (
        <>
          Unstable air. Greater than{" "}
          {renderLapseRate(velitherm.gamma, temperatureUnit, heightUnit)} (
          <strong>dry adiabatic lapse rate</strong>), this indicates{" "}
          <strong>turbulence</strong> and <strong>thermals</strong>, especially
          when found over a large altitude range. Warmer air parcels will
          continue rising.
        </>
      );

    if (lapseRate > saturatedLapseRateThreshold)
      return (
        <>
          Conditionally unstable air. Greater than the{" "}
          <strong>
            <Moist>moist adiabatic lapse rate</Moist>
          </strong>{" "}
          of{" "}
          {renderLapseRate(
            saturatedLapseRateThreshold,
            temperatureUnit,
            heightUnit
          )}{" "}
          for this height. Any cumulus <FontAwesomeIcon icon={faCloud} /> may
          continue to grow.
        </>
      );
  }

  function lapseColor(
    lapseRate: number,
    saturatedLapseRateThreshold: number,
    saturated: boolean
  ): [number, number, number] {
    if (lapseRate < 0) return [0, 255, 0];

    if (lapseRate > velitherm.gamma) return [255, 0, 0];

    if (saturated && lapseRate > saturatedLapseRateThreshold)
      return [255, 0, 0];

    return [255, 255, 0];
  }

  function renderContents() {
    return (
      <>
        <div>
          Lapse rate{" "}
          <strong
            css={css`
              ${outputP3ColorFromRGB(
                lapseColor(lapseRate, saturatedLapseRateThreshold, saturated)
              )}
            `}
          >
            {renderLapseRate(lapseRate, temperatureUnit, heightUnit)}
          </strong>
        </div>
        <About>{renderExplanation()}</About>
      </>
    );
  }

  return (
    <Tooltip contents={renderContents} offset={-5}>
      {children}
    </Tooltip>
  );
}
