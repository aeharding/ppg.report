import { css, keyframes } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faLongArrowRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { useAppSelector } from "../../hooks";
import Precipitation from "./header/Precipitation";
import { isWithinInterval } from "../../helpers/date";
import Airport from "./header/Airport";
import SkyCover from "./header/SkyCover";
import Weather from "./header/Weather";
import Alerts from "./header/Alerts";

export enum HeaderType {
  Normal,
  Warning,
  Danger,
}

const Container = styled.div<{ type: HeaderType }>`
  width: 100%;
  display: block;
  margin-top: -0.75rem;
  padding: 0 1.25rem;
  margin-bottom: 0.3rem;
  height: 3rem;

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

const GoIcon = styled(FontAwesomeIcon)`
  margin-left: auto;
  font-size: 1.4em;
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
  const alerts = useAppSelector((state) => state.weather.alerts);

  const relevantAlerts = useMemo(
    () =>
      typeof alerts === "object"
        ? alerts.features.filter((alert) =>
            isWithinInterval(new Date(date), {
              start: new Date(alert.properties.onset),
              end: new Date(alert.properties.ends),
            })
          )
        : undefined,
    [alerts, date]
  );

  if (weather === "failed" || alerts === "failed") return <></>;
  if (
    !weather ||
    weather === "pending" ||
    !alerts ||
    alerts === "pending" ||
    !relevantAlerts
  )
    return (
      <Container type={HeaderType.Normal}>
        <Loading>Loading...</Loading>
      </Container>
    );

  let type: HeaderType = relevantAlerts.length
    ? HeaderType.Warning
    : HeaderType.Normal;

  if (
    relevantAlerts.filter(
      (alert) =>
        !alert.properties.headline?.includes("Watch") &&
        (alert.properties.severity === "Extreme" ||
          alert.properties.severity === "Severe")
    ).length
  ) {
    type = HeaderType.Danger;
  }

  return (
    <Container type={type}>
      <>
        <Alerts alerts={relevantAlerts} />
        <Weather weather={weather} date={date} />{" "}
        <Precipitation weather={weather} date={date} />{" "}
        <SkyCover header={type} weather={weather} date={date} />{" "}
        <Micro icon={<Airport fr="vfr">KMSN</Airport>}>SCT@4k </Micro>
      </>{" "}
      <GoIcon icon={faLongArrowRight} />
    </Container>
  );
}
