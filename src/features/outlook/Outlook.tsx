import { useAppSelector } from "../../hooks";
import Error from "../../shared/Error";
import Loading from "../../shared/Loading";
import ReportWatchdog from "../rap/ReportWatchdog";
import { currentWeather } from "../weather/weatherSlice";
import Hourly from "./hourly/Hourly";
import Summary from "./summary/Summary";
import { ReactComponent as ErrorSvg } from "../../assets/error.svg";
import { rap } from "../rap/rapSlice";
import { Link } from "react-router-dom";
import styled from "@emotion/styled/macro";

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

  switch (weather) {
    case undefined:
    case "pending":
      return <Loading />;
    case "failed":
      if (typeof report === "object")
        return (
          <Error
            icon={ErrorSvg}
            title="Report unavailable"
            description={
              <>
                The weather outlook has failed to load, but the winds aloft
                report is available.
                <br />
                <br />
                <StyledLink to="../aloft">Go to winds aloft</StyledLink>
              </>
            }
          />
        );

      return (
        <Error
          icon={ErrorSvg}
          title="Connection error"
          description="Please check your internet connection, and try again later if this error remains."
        />
      );
  }

  if (typeof weather !== "object") return <Loading />;

  return (
    <>
      <Summary />
      <Hourly />
      <ReportWatchdog />
    </>
  );
}
