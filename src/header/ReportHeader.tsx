import {
  faSunrise,
  faSunset,
  faMapMarkerAlt,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import SunCalc from "suncalc";
import { format } from "date-fns";
import styled from "@emotion/styled/macro";

const Icon = styled(FontAwesomeIcon)`
  && {
    width: 1.3em;
  }
`;

const SunLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface ReportHeaderProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function ReportHeader(props: ReportHeaderProps) {
  const { lat, lon } = props.match.params;

  const [times] = useState(SunCalc.getTimes(new Date(new Date()), +lat, +lon));

  return (
    <>
      <Icon icon={faMapMarkerAlt} />{" "}
      <a
        href={`https://duckduckgo.com/?q=${encodeURIComponent(
          `${lat}, ${lon}`
        )}&iaxm=maps`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {lat}, {lon}
      </a>
      <br />
      <SunLine>
        <span>
          <Icon icon={faSunset} /> {format(times.sunset, "h:mm")}
        </span>
        &nbsp;&nbsp;
        <span>
          <Icon icon={faSunrise} /> {format(times.sunrise, "h:mm")}
        </span>
      </SunLine>
    </>
  );
}
