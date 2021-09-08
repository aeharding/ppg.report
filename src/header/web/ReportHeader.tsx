import {
  faSunrise,
  faSunset,
  faMapMarkerAlt,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import SunCalc from "suncalc";
import styled from "@emotion/styled/macro";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import format from "date-fns/format";

const Icon = styled(FontAwesomeIcon)`
  && {
    width: 1.3em;
  }
`;

const SunLine = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

interface ReportHeaderProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function ReportHeader(props: ReportHeaderProps) {
  const { lat, lon } = props.match.params;

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));

  return (
    <>
      <Icon icon={faMapMarkerAlt} />{" "}
      <a
        href={`http://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12&layers=M`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <ReverseLocation lat={lat} lon={lon} />
      </a>
      <br />
      <SunLine>
        <span>
          <Icon icon={faSunrise} /> {format(times.sunrise, "h:mmaaaaa")}
        </span>
        &nbsp;&nbsp;
        <span>
          <Icon icon={faSunset} /> {format(times.sunsetStart, "h:mmaaaaa")}
        </span>
      </SunLine>
    </>
  );
}
