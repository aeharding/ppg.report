import {
  faSunrise,
  faSunset,
  faMapMarkerAlt,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SunCalc from "suncalc";
import styled from "@emotion/styled";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../../features/weather/weatherSlice";

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

export default function ReportHeader() {
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");

  if (!lat || !lon || isNaN(+lat) || isNaN(+lon)) return null;

  return <ReportHeaderValidProps lat={lat} lon={lon} />;
}

interface ReportHeaderProps {
  lat: string;
  lon: string;
}

function ReportHeaderValidProps({ lat, lon }: ReportHeaderProps) {
  const timeZone = useAppSelector(timeZoneSelector);

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));

  if (!timeZone) return <></>;

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
          <Icon icon={faSunrise} />{" "}
          {formatInTimeZone(times.sunrise, timeZone, "h:mmaaaaa")}
        </span>
        &nbsp;&nbsp;
        <span>
          <Icon icon={faSunset} />{" "}
          {formatInTimeZone(times.sunsetStart, timeZone, "h:mmaaaaa")}
        </span>
      </SunLine>
    </>
  );
}
