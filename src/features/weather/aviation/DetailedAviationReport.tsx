import styled from "@emotion/styled";
import { faExternalLink } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceStrict } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { IForecastContainer } from "metar-taf-parser";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../weatherSlice";
import Forecast, { formatWithTomorrowIfNeeded } from "./Forecast";

const Container = styled.div`
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1rem 1rem 0;
`;

const Description = styled.div`
  margin: 0 1rem 1rem;
`;

const Forecasts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 0 1rem;
`;

const OpenExternal = styled.a`
  margin: 0 auto 1rem;
  padding: 1rem;
  opacity: 0.5;

  display: flex;
  gap: 0.5rem;

  svg {
    margin-top: 2px;
    font-size: 0.6em;
  }
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
            ? `High of ${cToF(
                taf.maxTemperature.temperature
              )}℉ at ${formatWithTomorrowIfNeeded(
                taf.maxTemperature.date,
                timeZone,
                "p"
              )}.`
            : undefined}{" "}
          {taf.minTemperature
            ? `Low of ${cToF(
                taf.minTemperature.temperature
              )}℉ at ${formatWithTomorrowIfNeeded(
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

      <OpenExternal
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.aviationweather.gov/taf/data?ids=${taf.station}&format=decoded&metars=on`}
      >
        aviationweather.gov <FontAwesomeIcon icon={faExternalLink} />
      </OpenExternal>
    </Container>
  );
}

function cToF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}
