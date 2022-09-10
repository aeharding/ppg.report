import styled from "@emotion/styled/macro";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { useAppSelector } from "../../hooks";
import { TFRFeature } from "../../services/faa";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { isWeatherAlert } from "./alertsSlice";

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  > *:last-child {
    text-align: right;
  }
`;

interface TimesProps {
  alert: WeatherAlertFeature | TFRFeature;
}

export default function Times({ alert }: TimesProps) {
  return (
    <Container>
      <Time
        time={
          new Date(
            isWeatherAlert(alert)
              ? alert.properties.onset
              : alert.properties.coreNOTAMData.notam.effectiveStart
          )
        }
      >
        Start
      </Time>
      <Time
        time={
          isWeatherAlert(alert)
            ? new Date(alert.properties.ends || alert.properties.expires)
            : alert.properties.coreNOTAMData.notam.effectiveEnd === "PERM"
            ? undefined
            : new Date(alert.properties.coreNOTAMData.notam.effectiveEnd)
        }
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
}

function Time({ children, time }: TimeProps) {
  const timeZone = useAppSelector((state) => state.weather.timeZone);

  if (!timeZone) throw new Error("timezone must be defined");

  return (
    <div>
      <Label>{children}</Label>
      <TimeLabel>
        {time ? formatInTimeZone(time, timeZone, "p") : "Permanent"}
      </TimeLabel>
      {time ? (
        <div>{formatInTimeZone(time, timeZone, "eeee, MMMM do")}</div>
      ) : (
        ""
      )}
    </div>
  );
}
