import { css, keyframes } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { useAppSelector } from "../../hooks";
import Precipitation from "./header/Precipitation";
import { isWithinInterval } from "../../helpers/date";
import Airport from "./header/Airport";
import SkyCover from "./header/SkyCover";
import Weather from "./header/Weather";
import AlertsIcon from "./header/AlertsIcon";
import { tafReport as tafReportSelector } from "./weatherSliceLazy";
import Wind from "./header/Wind";
import {
  alertsBySeveritySortFn,
  isAlertDangerous,
} from "../../helpers/weather";
import { addMinutes, addYears, startOfHour } from "date-fns";
import { alertsSelector, isWeatherAlert } from "../alerts/alertsSlice";
import { WeatherAlertFeature } from "./weatherSlice";
import { TFRFeature } from "../../services/faa";

export enum HeaderType {
  Normal,
  Warning,
  Danger,
}

const Container = styled.div<{ type: HeaderType }>`
  width: 100%;
  margin-top: -0.75rem;
  padding: 0 1.25rem;
  margin-bottom: 0.3rem;
  height: 3rem;
  overflow: hidden;
  position: relative;

  display: flex;
  align-items: center;

  border: 1px solid transparent;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  ${({ type }) => {
    switch (type) {
      case HeaderType.Danger:
        return css`
          ${outputP3ColorFromRGB([255, 0, 0])}
          background: #260101a3;
          border-color: #640000;
        `;
      case HeaderType.Warning:
        return css`
          ${outputP3ColorFromRGB([255, 255, 0])}
          background: #1c2601a2;
          border-color: #5f6400;
        `;
      case HeaderType.Normal:
        return css`
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffffec;
        `;
    }
  }}
`;

export const MicroContents = styled.div`
  margin-right: 0.25rem;
  padding-right: 0.25rem;
  line-height: 1.3;
  font-size: 0.95em;
  transform: translateY(1px);

  display: flex;
  align-items: center;
  flex-direction: column;

  > div {
    display: flex;
  }
`;

const pulse = keyframes`
  from {
    opacity: 0.4;
  }
  to {
    opacity: 0.6;
  }
`;

const Loading = styled.div`
  margin: auto;
  animation: ${pulse} 1.5s ease-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

interface MicroProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function Micro({ icon, children }: MicroProps) {
  return (
    <MicroContents>
      <div>{icon}</div>
      <div>{children}</div>
    </MicroContents>
  );
}

interface WeatherHeaderProps {
  date: string;
}

export default function WeatherHeader({ date }: WeatherHeaderProps) {
  const weather = useAppSelector((state) => state.weather.weather);
  const alerts = useAppSelector(alertsSelector);
  const tafReport = useAppSelector(tafReportSelector);

  const relevantAlerts = useMemo(
    () =>
      typeof alerts === "object"
        ? alerts
            .filter((alert) => isAlertActive(alert, date))
            .sort(alertsBySeveritySortFn)
        : undefined,
    [alerts, date]
  );

  if (weather === "failed") return <></>;
  if (!weather || weather === "pending" || !relevantAlerts)
    return (
      <Container type={HeaderType.Normal}>
        <Loading>Loading...</Loading>
      </Container>
    );

  let type: HeaderType = relevantAlerts.length
    ? HeaderType.Warning
    : HeaderType.Normal;

  if (relevantAlerts.filter(isAlertDangerous).length) {
    type = HeaderType.Danger;
  }

  return (
    <Container type={type} onClick={(e) => e.stopPropagation()}>
      <>
        <AlertsIcon alerts={relevantAlerts} />
        <Weather weather={weather} date={date} />{" "}
        <SkyCover weather={weather} date={date} />{" "}
        <Precipitation headerType={type} weather={weather} date={date} />{" "}
        {tafReport ? <Airport taf={tafReport} date={date} /> : ""}
        <Wind headerType={type} weather={weather} date={date} />{" "}
      </>
    </Container>
  );
}

function isAlertActive(
  alert: WeatherAlertFeature | TFRFeature,
  date: string
): boolean {
  if (isWeatherAlert(alert))
    return isWithinInterval(new Date(date), {
      start: startOfHour(new Date(alert.properties.onset)),
      end: addMinutes(
        new Date(alert.properties.ends || alert.properties.expires),
        -1
      ),
    });

  return isWithinInterval(new Date(date), {
    start: startOfHour(
      new Date(alert.properties.coreNOTAMData.notam.effectiveStart)
    ),
    end:
      alert.properties.coreNOTAMData.notam.effectiveEnd === "PERM"
        ? addYears(new Date(), 10)
        : addMinutes(
            new Date(alert.properties.coreNOTAMData.notam.effectiveEnd),
            -1
          ),
  });
}
