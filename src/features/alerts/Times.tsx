import styled from "@emotion/styled";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { useAppSelector } from "../../hooks";
import {
  Alert,
  getAlertEnd,
  getAlertStart,
  getGroupedGAirmetAlertEnd,
  getGroupedGAirmetAlertStart,
  isGAirmetAlert,
} from "./alertsSlice";
import { getTimeFormatString } from "../weather/aviation/Forecast";

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  > *:last-child {
    text-align: right;
  }
`;

interface TimesProps {
  alert: Alert;
  includeYear: boolean;
  noEndLabel: string;
}

export default function Times({ alert, includeYear, noEndLabel }: TimesProps) {
  const aviationAlertsResult = useAppSelector(
    (state) => state.weather.aviationAlerts,
  );

  const aviationAlerts =
    typeof aviationAlertsResult === "object" ? aviationAlertsResult : [];

  const start = isGAirmetAlert(alert)
    ? new Date(getGroupedGAirmetAlertStart(alert, aviationAlerts))
    : new Date(getAlertStart(alert));

  const end = isGAirmetAlert(alert)
    ? getGroupedGAirmetAlertEnd(alert, aviationAlerts)
    : getAlertEnd(alert);

  return (
    <Container>
      <Time time={start} includeYear={includeYear} noEndLabel={noEndLabel}>
        Start
      </Time>
      <Time
        time={end ? new Date(end) : undefined}
        includeYear={includeYear}
        noEndLabel={noEndLabel}
      >
        End
      </Time>
    </Container>
  );
}

const Label = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8em;
`;

const TimeLabel = styled.div`
  font-size: 1.3em;
  font-weight: 300;
`;

interface TimeProps {
  children: React.ReactNode;
  time?: Date;
  includeYear: boolean;
  noEndLabel: string;
}

function Time({ children, time, includeYear, noEndLabel }: TimeProps) {
  const timeZone = useAppSelector((state) => state.weather.timeZone);
  const timeFormat = useAppSelector((state) => state.user.timeFormat);

  if (!timeZone) throw new Error("timezone must be defined");

  return (
    <div>
      <Label>{children}</Label>
      <TimeLabel>
        {time
          ? formatInTimeZone(time, timeZone, getTimeFormatString(timeFormat))
          : noEndLabel}
      </TimeLabel>
      {time ? (
        <div>
          {formatInTimeZone(
            time,
            timeZone,
            includeYear ? "eeee, MMMM do yyyy" : "eeee, MMMM do",
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
