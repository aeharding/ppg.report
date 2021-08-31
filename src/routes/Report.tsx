import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";

interface ReportProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function Report(props: ReportProps) {
  const { lat, lon } = props.match.params;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRap(+lat, +lon));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>The Report!</>;
}
