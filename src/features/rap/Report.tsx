import { useAppSelector } from "../../hooks";
import { connectionError, coordinatesError } from "../../routes/LatLon";
import Loading from "../../shared/Loading";
import { timeZoneSelector } from "../weather/weatherSlice";
import Hours from "./Hours";
import { rap } from "./rapSlice";

export default function Report() {
  const report = useAppSelector(rap);
  const timeZoneLoading = useAppSelector(
    (state) => state.weather.timeZoneLoading
  );
  const timeZone = useAppSelector(timeZoneSelector);

  switch (report) {
    case "pending":
    case undefined:
      return <></>;
    case "failed":
      return connectionError;
    case "coordinates-error":
      return coordinatesError;
    default:
      if (timeZoneLoading) return <Loading />;

      if (!timeZone) return connectionError;

      return <Hours rap={report} />;
  }
}
