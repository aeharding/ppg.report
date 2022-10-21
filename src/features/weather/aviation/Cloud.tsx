import { ICloud } from "metar-taf-parser";
import { formatCloud } from "../header/Airport";

interface CloudProps {
  data: ICloud;
}

export default function Cloud({ data }: CloudProps) {
  return <>{formatCloud(data)}</>;
}
