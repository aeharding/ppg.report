import { ICloud } from "metar-taf-parser";
import { formatCloud } from "../../../helpers/taf";

interface CloudProps {
  data: ICloud;
}

export default function Cloud({ data }: CloudProps) {
  return <>{formatCloud(data)}</>;
}
