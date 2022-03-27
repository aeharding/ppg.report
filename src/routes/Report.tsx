import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";
import Hours from "../features/rap/Hours";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";
import Error from "../shared/Error";
import { ReactComponent as Map } from "../assets/map.svg";
import { ReactComponent as ErrorSvg } from "../assets/error.svg";
import NotFound from "./NotFound";

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
  const rap = useAppSelector(
    (state) => state.rap.rapByLocation[getTrimmedCoordinates(+lat, +lon)]
  );

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getRap(+lat, +lon));
  }, [dispatch, lat, lon]);

  if (!isLatLonTrimmed(lat, lon)) {
    return <Navigate to={`/${getTrimmedCoordinates(+lat, +lon)}`} replace />;
  }

  switch (rap) {
    case "pending":
    case undefined:
      return <Loading />;
    case "failed":
      return (
        <Error
          icon={ErrorSvg}
          title="Connection error"
          description="Please check your internet connection, and try again later if this error remains."
        />
      );
    case "coordinates-error":
      return (
        <Error
          icon={Map}
          title="That's an unknown place."
          description="Contiguous United States locations are only supported."
        />
      );
    default:
      return <Hours rap={rap} />;
  }
}
