import { useState } from "react";
import SunCalc from "suncalc";
import { faSunrise, faSunset } from "@fortawesome/pro-duotone-svg-icons";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../../features/weather/weatherSlice";
import { getTimeFormatString } from "../../features/weather/aviation/Forecast";
import { isValidDate } from "../../helpers/date";
import styled from "@emotion/styled";
import { Icon, ReportHeaderProps } from "./ReportHeader";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

const SunLine = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export default function Sun({ lat, lon }: ReportHeaderProps) {
  const timeFormat = useAppSelector((state) => state.user.timeFormat);
  const timeZone = useAppSelector(timeZoneSelector);

  const [times] = useState(SunCalc.getTimes(new Date(), +lat, +lon));

  if (!timeZone) return <></>;

  const sunrise = times.sunrise;
  const sunset = times.sunsetStart;

  // suncalc doesn't work with 70.922,-8.716, for example
  if (!isValidDate(sunrise) || !isValidDate(sunset)) return <></>;

  return (
    <SunLine>
      <span>
        <Icon icon={faSunrise} />{" "}
        {format(
          new TZDate(sunrise, timeZone),
          getTimeFormatString(timeFormat, true),
        )}
      </span>
      &nbsp;&nbsp;
      <span>
        <Icon icon={faSunset} />{" "}
        {format(
          new TZDate(sunset, timeZone),
          getTimeFormatString(timeFormat, true),
        )}
      </span>
    </SunLine>
  );
}
