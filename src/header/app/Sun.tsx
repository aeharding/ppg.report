import { ReportHeaderProps } from "./ReportHeader";
import { useState } from "react";
import SunCalc from "suncalc";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../../features/weather/weatherSlice";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { getTimeFormatString } from "../../features/weather/aviation/Forecast";
import { isValidDate } from "../../helpers/date";
import { faSunrise, faSunset } from "@fortawesome/pro-duotone-svg-icons";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export default function Sun({ lat, lon }: ReportHeaderProps) {
  const timeFormat = useAppSelector((state) => state.user.timeFormat);
  const timeZone = useAppSelector(timeZoneSelector);

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));

  if (!timeZone) return <></>;

  const sunrise = times.sunrise;
  const sunset = times.sunsetStart;

  if (!isValidDate(sunrise) || !isValidDate(sunset)) return <></>;
  if (!timeZone) return <></>;

  return (
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
  );
}
