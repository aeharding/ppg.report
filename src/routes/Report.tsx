import { useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";
import Hours from "../features/rap/Hours";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";
import Error from "../Error";
import { ReactComponent as Map } from "../icons/map.svg";
import { ReactComponent as ErrorSvg } from "../icons/error.svg";

interface ReportProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function Report(props: ReportProps) {
  const { lat, lon } = props.match.params;

  const dispatch = useAppDispatch();
  const rap = useAppSelector(
    (state) => state.rap.rapByLocation[getTrimmedCoordinates(+lat, +lon)]
  );

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getRap(+lat, +lon));
  }, [dispatch, lat, lon]);

  if (!isLatLonTrimmed(lat, lon)) {
    return <Redirect to={getTrimmedCoordinates(+lat, +lon)} push={false} />;
  }

  switch (rap) {
    case "pending":
    case undefined:
      return <Loading />;
    case "failed":
      return (
        <Error
          icon={ErrorSvg}
          title="shit broke"
          description="It appears there was a problem with the data source. Please try again later."
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
