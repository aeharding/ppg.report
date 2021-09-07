import { RouteComponentProps } from "react-router";
import ReverseLocation from "../../features/geocode/ReverseLocation";

interface ReportHeaderProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function ReportHeader(props: ReportHeaderProps) {
  const { lat, lon } = props.match.params;

  return <ReverseLocation lat={lat} lon={lon} />;
}
