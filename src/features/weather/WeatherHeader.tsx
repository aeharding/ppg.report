import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faBullhorn, faLongArrowRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { useAppSelector } from "../../hooks";
import Precipitation from "./header/Precipitation";
import { isWithinInterval } from "../../helpers/date";
import Airport from "./header/Airport";

enum Style {
  Normal,
  Warning,
  Danger,
}

const Container = styled.div<{ type: Style }>`
  width: 100%;
  display: block;
  margin-top: -0.75rem;
  padding: 0 1.75rem 0 2rem;
  margin-bottom: 0.3rem;
  height: 3rem;

  display: flex;
  align-items: center;

  border: 1px solid transparent;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  ${({ type }) => {
    switch (type) {
      case Style.Danger:
        return css`
          ${outputP3ColorFromRGB([255, 0, 0])}
          background: #260101a3;
          border-color: #640000;
        `;
      case Style.Warning:
        return css`
          ${outputP3ColorFromRGB([255, 255, 0])}
          background: #1c2601a2;
          border-color: #5f6400;
        `;
      case Style.Normal:
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
  const { lat, lon } = useParams<"lat" | "lon">();
  if (!lat || !lon) throw new Error("lat and lon should be defined");

  const weather = useAppSelector(
    (state) =>
      state.weather.weatherByCoordinates[getTrimmedCoordinates(+lat, +lon)]
  );
  const alerts = useAppSelector(
    (state) =>
      state.weather.alertsByCoordinates[getTrimmedCoordinates(+lat, +lon)]
  );

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

  if (!weather || weather === "pending" || weather === "failed") return <></>;
  if (!alerts || alerts === "pending" || alerts === "failed" || !relevantAlerts)
    return <></>;

  let type: Style = relevantAlerts.length ? Style.Warning : Style.Normal;

  if (
    relevantAlerts.filter(
      (alert) =>
        alert.properties.severity === "Extreme" ||
        alert.properties.severity === "Severe"
    ).length
  ) {
    type = Style.Danger;
  }

  return (
    <Container type={type}>
      <>
        {relevantAlerts.length ? (
          <Micro icon={<FontAwesomeIcon icon={faBullhorn} />}>
            &nbsp;{relevantAlerts.length}
          </Micro>
        ) : (
          ""
        )}
        <Precipitation weather={weather} date={date} />{" "}
        <Micro icon={<Airport fr="vfr">KMSN</Airport>}>SCT@4k </Micro>
      </>{" "}
      <GoIcon icon={faLongArrowRight} />
    </Container>
  );
}
