import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";
import Table from "../features/rap/Table";
import { useAppSelector } from "../hooks";
import Loading from "../shared/Loading";

interface ReportProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function Report(props: ReportProps) {
  const { lat, lon } = props.match.params;

  const dispatch = useDispatch();
  const rap = useAppSelector(
    (state) => state.rap.rapByLocation[`${+lat},${+lon}`]
  );

  useEffect(() => {
    dispatch(getRap(+lat, +lon));
  }, [dispatch, lat, lon]);

  switch (rap) {
    case "pending":
    case undefined:
      return <Loading />;
    case "failed":
      return <>The request failed.</>;
    default:
      return <Table raps={rap} />;
  }
}
