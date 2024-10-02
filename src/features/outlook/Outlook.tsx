import { useAppSelector } from "../../hooks";
import OutlookTable from "./OutlookTable";

export default function Outlook() {
  const weather = useAppSelector((state) => state.weather.weather);

  if (weather === "failed") return;
  if (!weather || weather === "pending") return;

  return <OutlookTable weather={weather} />;
}
