/** @jsxImportSource @emotion/react */

import { useAppDispatch, useAppSelector } from "../../hooks";
import useInterval from "../../helpers/useInterval";
import { usePageVisibility } from "react-page-visibility";
import { useEffect, useState } from "react";
import { getRap } from "./rapSlice";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { getWeather } from "../weather/weatherSlice";
import { useParams } from "react-router-dom";
import { Rap } from "gsl-parser";

interface ReportWatchdogProps {
  rap: Rap[];
}

export default function ReportWatchdog({ rap }: ReportWatchdogProps) {
  const dispatch = useAppDispatch();
  const visibility = usePageVisibility();
  const rapUpdated = useAppSelector((state) => state.rap.rapUpdated);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const { lat, lon } = useParams();
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

  return (
    <>
      <div>
        <span
          css={{
            color:
              rapUpdated &&
              Math.abs(differenceInMinutes(new Date(rapUpdated), new Date())) >
                30
                ? "red"
                : undefined,
          }}
        >
          Last updated{" "}
          {rapUpdated
            ? formatDistanceToNow(new Date(rapUpdated), {
                addSuffix: true,
              })
            : "never"}
        </span>
        <br />
        Automatically updates every 30 minutes
      </div>
    </>
  );
}
