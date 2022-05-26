import { useAppSelector } from "../../hooks";
import Error from "../../shared/Error";
import Loading from "../../shared/Loading";
import ReportWatchdog from "../rap/ReportWatchdog";
import {
  currentWeather,
  timeZoneSelector,
  WeatherResult,
} from "../weather/weatherSlice";
import Hourly from "./hourly/Hourly";
import Summary from "./summary/Summary";
import { ReactComponent as ErrorSvg } from "../../assets/error.svg";
import { rap, RapResult } from "../rap/rapSlice";
import { Link } from "react-router-dom";
import styled from "@emotion/styled/macro";
import { connectionError, coordinatesError } from "../../routes/LatLon";

const StyledLink = styled(Link)`
  display: inline-block;
  border: 1px solid white;
  border-radius: 5px;
  padding: 2px 6px;

  &,
  &:hover {
    text-decoration: none;
  }
`;

export function Outlook() {
  const weather = useAppSelector(currentWeather);
  const report = useAppSelector(rap);
  const timeZoneLoading = useAppSelector(
    (state) => state.weather.timeZoneLoading
  );
  const timeZone = useAppSelector(timeZoneSelector);

  if (!ready(report) || !ready(weather)) return <Loading />;

  if (timeZoneLoading) return <Loading />;

  if (weather === "failed") {
    if (typeof report === "object")
      return (
        <Error
          icon={ErrorSvg}
          title="Report unavailable"
          description={
            <>
              The weather outlook has failed to load, but the winds aloft report
              is available.
              <br />
              <br />
              <StyledLink to="../aloft">Go to winds aloft</StyledLink>
            </>
          }
        />
      );

    return connectionError;
  }

  if (report === "coordinates-error") return coordinatesError;

  if (!timeZone) return connectionError;

  function ready(payload: RapResult | WeatherResult | undefined) {
    return payload && payload !== "pending";
  }

  return (
    <>
      <Summary />
      <Hourly />
      <ReportWatchdog />
    </>
  );
}
