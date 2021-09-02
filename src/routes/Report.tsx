import { useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";
import Table from "../features/rap/Table";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";

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
      return <>The request failed.</>;
    default:
      return <Table rap={rap} />;
  }
}
