import styled from "@emotion/styled/macro";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { faSunrise, faSunset } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps } from "react-router";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import format from "date-fns/format";
import { useState } from "react";
import SunCalc from "suncalc";

const BackButton = styled.div`
  position: absolute;
  left: 0;

  width: 50px;
  height: 50px;
  font-size: 1.3em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Location = styled.div`
  font-size: 0.91em;
  margin: auto;
  width: 60%;

  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SunsetSunrise = styled.div`
  position: absolute;
  right: 0.3rem;

  font-size: 0.8em;
  line-height: 1.7;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

interface ReportHeaderProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function ReportHeader(props: ReportHeaderProps) {
  const { lat, lon } = props.match.params;

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));

  return (
    <>
      <BackButton>
        <FontAwesomeIcon icon={faArrowLeft} />
      </BackButton>
      <Location>
        <ReverseLocation lat={lat} lon={lon} />
      </Location>
      <SunsetSunrise>
        <div>
          {format(times.sunrise, "h:mmaaaaa")}{" "}
          <FontAwesomeIcon icon={faSunrise} />
        </div>
        <div>
          {format(times.sunsetStart, "h:mmaaaaa")}{" "}
          <FontAwesomeIcon icon={faSunset} />
        </div>
      </SunsetSunrise>
    </>
  );
}
