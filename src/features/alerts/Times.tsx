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
  includeYear: boolean;
}

export default function Times({ alert, includeYear }: TimesProps) {
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
        includeYear={includeYear}
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
        includeYear={includeYear}
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
}

function Time({ children, time, includeYear }: TimeProps) {
  const timeZone = useAppSelector((state) => state.weather.timeZone);

  if (!timeZone) throw new Error("timezone must be defined");

  return (
    <div>
      <Label>{children}</Label>
      <TimeLabel>
        {time ? formatInTimeZone(time, timeZone, "p") : "Permanent"}
      </TimeLabel>
      {time ? (
        <div>
          {formatInTimeZone(
            time,
            timeZone,
            includeYear ? "eeee, MMMM do yyyy" : "eeee, MMMM do"
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
