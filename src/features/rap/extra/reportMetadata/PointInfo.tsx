import { useParams } from "react-router-dom";
import { DataListItem } from "../../../../DataList";
import { useAppSelector } from "../../../../hooks";
import {
  heightUnitFormatter,
  heightValueFormatter,
} from "../../cells/Altitude";

export default function PointInfo() {
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const heightUnitLabel = heightUnitFormatter(heightUnit);

  const windsAloft = useAppSelector((state) => state.weather.windsAloft);
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  const elevation = useAppSelector((state) => state.weather.elevation);
  if (!lat || !lon) throw new Error("lat or lon not defined!");
  if (!windsAloft || typeof windsAloft !== "object")
    throw new Error("RAP not defined");

  const altitudeInM = windsAloft.hours[0].altitudes[0].altitudeInM;

  const showOp40 =
    typeof windsAloft === "object" && windsAloft.source === "rucSounding";

  const source = (() => {
    switch (windsAloft.source) {
      case "openMeteo":
        return (
          <>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              open-meteo.com
            </a>{" "}
            / Best model
          </>
        );
      case "rucSounding":
        return (
          <>
            <a
              href="https://rucsoundings.noaa.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              rucsoundings.noaa.gov
            </a>{" "}
            / Op40
          </>
        );
    }
  })();

  return (
    <>
      <DataListItem>
        <div>Location elevation</div>
        <div>
          {Math.round(
            heightValueFormatter(elevation ?? -1, heightUnit)
          ).toLocaleString()}
          {heightUnitLabel}
        </div>
      </DataListItem>
      {showOp40 && (
        <DataListItem>
          <div>Winds aloft gridpoint elevation</div>
          <div>
            {Math.round(
              heightValueFormatter(altitudeInM, heightUnit)
            ).toLocaleString()}
            {heightUnitLabel}
          </div>
        </DataListItem>
      )}
      <DataListItem>
        <div>Source/model</div>
        <div>{source}</div>
      </DataListItem>
    </>
  );
}
