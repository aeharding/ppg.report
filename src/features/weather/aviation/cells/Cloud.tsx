import { ICloud } from "metar-taf-parser";
import { formatCloud } from "../../../../helpers/taf";
import { useAppSelector } from "../../../../hooks";

interface CloudProps {
  data: ICloud;
}

export default function Cloud({ data }: CloudProps) {
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  return <>{formatCloud(data, heightUnit)}</>;
}
