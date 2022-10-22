import styled from "@emotion/styled/macro";
import { formatDistanceStrict } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { IForecastContainer } from "metar-taf-parser";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../weatherSlice";
import Forecast, { formatWithTomorrowIfNeeded } from "./Forecast";

const Container = styled.div`
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1rem;
`;

const Description = styled.div`
  margin: 1rem;
`;

const Forecasts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 0 1rem;
`;

interface DetailedAviationReportProps {
  taf: IForecastContainer;
}

export default function DetailedAviationReport({
  taf,
}: DetailedAviationReportProps) {
  const timeZone = useAppSelector(timeZoneSelector);

  if (!timeZone) throw new Error("timezone undefined");

  return (
    <Container>
      <Title>Forecast</Title>

      <Description>
        <p>
          {taf.amendment ? "Amended " : ""} TAF report from {taf.station} issued{" "}
          {formatInTimeZone(taf.issued, timeZone, "p")} and is valid for{" "}
          {formatDistanceStrict(taf.end, taf.start, { unit: "hour" })} starting
          at {formatWithTomorrowIfNeeded(taf.start, timeZone, "p")}.
        </p>

        <p>
          {taf.maxTemperature
            ? `High of ${
                taf.maxTemperature.temperature
              }℃ at ${formatWithTomorrowIfNeeded(
                taf.maxTemperature.date,
                timeZone,
                "p"
              )}.`
            : undefined}{" "}
          {taf.minTemperature
            ? `Low of ${
                taf.minTemperature.temperature
              }℃ at ${formatWithTomorrowIfNeeded(
                taf.minTemperature.date,
                timeZone,
                "p"
              )}.`
            : undefined}
        </p>
      </Description>

      <Forecasts>
        {taf.forecast.map((forecast, index) => (
          <Forecast data={forecast} key={index} />
        ))}
      </Forecasts>
    </Container>
  );
}
