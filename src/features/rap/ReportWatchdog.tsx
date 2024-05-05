import { useAppDispatch } from "../../hooks";
import useInterval from "../../helpers/useInterval";
import { usePageVisibility } from "react-page-visibility";
import { useEffect, useState } from "react";
import { getWeather } from "../weather/weatherSlice";
import { useParams } from "react-router";
import { WindsAloftHour } from "../../models/WindsAloft";

interface ReportWatchdogProps {
  hours: WindsAloftHour[];
}

export default function ReportWatchdog({ hours }: ReportWatchdogProps) {
  const dispatch = useAppDispatch();
  const visibility = usePageVisibility();
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  if (!lat || !lon) throw new Error("lat or lon not defined!");

  useInterval(() => {
    setLastUpdated(Date.now());
  }, 5000);

  useEffect(() => {
    setLastUpdated(Date.now());
  }, [visibility]);

  useEffect(() => {
    if (document.hidden) return;

    dispatch(getWeather(+lat, +lon));
  }, [lastUpdated, dispatch, hours, lat, lon]);

  return <></>;
}
