import { useAppDispatch } from "../../hooks";
import useInterval from "../../helpers/useInterval";
import { usePageVisibility } from "react-page-visibility";
import { useEffect, useState } from "react";
import { getRap } from "./rapSlice";
import { getWeather } from "../weather/weatherSlice";
import { useParams } from "react-router-dom";
import { Rap } from "gsl-parser";

interface ReportWatchdogProps {
  rap: Rap[];
}

export default function ReportWatchdog({ rap }: ReportWatchdogProps) {
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

    dispatch(getRap(+lat, +lon));
    dispatch(getWeather(+lat, +lon));
  }, [lastUpdated, dispatch, rap, lat, lon]);

  return <></>;
}
