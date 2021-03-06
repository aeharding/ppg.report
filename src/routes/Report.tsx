import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getRap, clear as clearRap } from "../features/rap/rapSlice";
import Hours from "../features/rap/Hours";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";
import Error from "../shared/Error";
import { ReactComponent as Map } from "../assets/map.svg";
import { ReactComponent as ErrorSvg } from "../assets/error.svg";
import NotFound from "./NotFound";
import {
  getWeather,
  clear as clearWeather,
  timeZoneSelector,
} from "../features/weather/weatherSlice";

export default function Report() {
  const { lat, lon } = useParams<"lat" | "lon">();

  if (!lat || !lon || isNaN(+lat) || isNaN(+lon)) return <NotFound />;

  return <ValidParamsReport lat={lat} lon={lon} />;
}

interface ValidParamsReportProps {
  lat: string;
  lon: string;
}

function ValidParamsReport({ lat, lon }: ValidParamsReportProps) {
  const dispatch = useAppDispatch();
  const rap = useAppSelector((state) => state.rap.rap);
  const timeZone = useAppSelector(timeZoneSelector);
  const timeZoneLoading = useAppSelector(
    (state) => state.weather.timeZoneLoading
  );

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getRap(+lat, +lon));
    dispatch(getWeather(+lat, +lon));

    return () => {
      dispatch(clearWeather());
      dispatch(clearRap());
    };
  }, [dispatch, lat, lon]);

  const connectionError = (
    <Error
      icon={ErrorSvg}
      title="Connection error"
      description="Please check your internet connection, and try again later if this error remains."
    />
  );

  if (!isLatLonTrimmed(lat, lon)) {
    return <Navigate to={`/${getTrimmedCoordinates(+lat, +lon)}`} replace />;
  }

  if (timeZoneLoading) return <Loading />;

  switch (rap) {
    case "pending":
    case undefined:
      return <Loading />;
    case "failed":
      return connectionError;
    case "coordinates-error":
      return (
        <Error
          icon={Map}
          title="That's an unknown place."
          description="Contiguous United States locations are only supported."
        />
      );
    default:
      if (!timeZone) return connectionError;
      return <Hours rap={rap} />;
  }
}
