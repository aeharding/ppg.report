import styled from "@emotion/styled/macro";
import { formatDistanceStrict } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { IForecastContainer } from "metar-taf-parser";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../weatherSlice";
import Forecast from "./Forecast";

const Container = styled.div`
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1rem;
`;

const Description = styled.p`
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
        TAF report from {taf.station} issued{" "}
        {formatInTimeZone(taf.issued, timeZone, "p")} and is valid for{" "}
        {formatDistanceStrict(taf.end, taf.start, { unit: "hour" })} starting at{" "}
        {formatInTimeZone(taf.start, timeZone, "p")}.
      </Description>

      <Forecasts>
        {taf.forecast.map((forecast, index) => (
          <Forecast data={forecast} key={index} />
        ))}
      </Forecasts>
    </Container>
  );
}
