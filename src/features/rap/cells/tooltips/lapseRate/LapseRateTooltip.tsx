import styled from "@emotion/styled";
import Tooltip from "../../../../../shared/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/pro-duotone-svg-icons";
import { css } from "@emotion/react";
import { outputP3ColorFromRGB } from "../../../../../helpers/colors";
import { useState } from "react";
import SunCalc from "suncalc";
import { useParams } from "react-router";
import * as velitherm from "velitherm";
import { useAppSelector } from "../../../../../hooks";
import { renderLapseRate } from "../../../../../helpers/lapseRate";
import { Trans } from "react-i18next";

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
        return <Trans i18nKey="Nocturnal temperature inversion information" />;
      }

      return <Trans i18nKey="Inversion information" />;
    }

    if (lapseRate > saturatedLapseRateThreshold && saturated) {
      return (
        <>
          <Trans
            i18nKey="Saturated unstable air information"
            values={{
              saturatedLapseRateThreshold: renderLapseRate(
                saturatedLapseRateThreshold,
                temperatureUnit,
                heightUnit,
              ),
            }}
          >
            <Moist>moist adiabatic lapse rate</Moist>
          </Trans>
        </>
      );
    }

    if (lapseRate > velitherm.gamma)
      return (
        <Trans
          i18nKey="Unstable air information"
          values={{
            dryAbiaticLapseRate: renderLapseRate(
              velitherm.gamma,
              temperatureUnit,
              heightUnit,
            ),
          }}
        />
      );

    if (lapseRate > saturatedLapseRateThreshold)
      return (
        <Trans
          i18nKey="Conditionally unstable air information"
          values={{
            saturatedLapseRateThreshold: renderLapseRate(
              saturatedLapseRateThreshold,
              temperatureUnit,
              heightUnit,
            ),
          }}
        >
          <Moist>moist adiabatic lapse rate</Moist>
          <FontAwesomeIcon icon={faCloud} />
        </Trans>
      );
  }

  function lapseColor(
    lapseRate: number,
    saturatedLapseRateThreshold: number,
    saturated: boolean,
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
          <Trans
            i18nKey="Lapse rate value information"
            values={{
              lapseRate: renderLapseRate(
                lapseRate,
                temperatureUnit,
                heightUnit,
              ),
            }}
          >
            <strong
              css={css`
                ${outputP3ColorFromRGB(
                  lapseColor(lapseRate, saturatedLapseRateThreshold, saturated),
                )}
              `}
            />
          </Trans>
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
