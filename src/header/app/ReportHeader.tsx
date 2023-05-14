import styled from "@emotion/styled";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { faSunrise, faSunset } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import { useState } from "react";
import SunCalc from "suncalc";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../../features/weather/weatherSlice";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { getTimeFormatString } from "../../features/weather/aviation/Forecast";

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
  const timeFormat = useAppSelector((state) => state.user.timeFormat);

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));
  const timeZone = useAppSelector(timeZoneSelector);

  return (
    <>
      <BackButton>
        <FontAwesomeIcon icon={faArrowLeft} />
      </BackButton>
      <Location>
        <ReverseLocation lat={lat} lon={lon} />
      </Location>
      {timeZone && (
        <SunsetSunrise>
          <div>
            {formatInTimeZone(
              times.sunrise,
              timeZone,
              getTimeFormatString(timeFormat, true)
            )}{" "}
            <FontAwesomeIcon icon={faSunrise} />
          </div>
          <div>
            {formatInTimeZone(
              times.sunsetStart,
              timeZone,
              getTimeFormatString(timeFormat, true)
            )}{" "}
            <FontAwesomeIcon icon={faSunset} />
          </div>
        </SunsetSunrise>
      )}
    </>
  );
}
