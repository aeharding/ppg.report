import styled from "@emotion/styled";
import { formatDistanceStrict } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useAppSelector } from "../hooks";
import useInterval from "../helpers/useInterval";
import { useState } from "react";

const Span = styled.time`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: rgba(255, 255, 255, 0.4);
`;

interface RelativeTimeProps {
  date: Date;
}

export default function RelativeTime({ date }: RelativeTimeProps) {
  const timeZone = useAppSelector((state) => state.weather.timeZone);
  const [distance, setDistance] = useState(getDistance());

  useInterval(() => {
    setDistance(getDistance());
  }, 5000);

  function getDistance() {
    return formatDistanceStrict(date, new Date(), { addSuffix: true });
  }

  if (!timeZone) throw new Error("timeZone not defined");

  return (
    <Span title={formatInTimeZone(date, timeZone, "PPPPpppp")}>{distance}</Span>
  );
}
