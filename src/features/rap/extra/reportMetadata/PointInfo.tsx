import { useParams } from "react-router";
import { DataListItem } from "../../../../DataList";
import { isInstalled } from "../../../../helpers/device";
import { useAppSelector } from "../../../../hooks";
import CopyToClipboard from "../../../../shared/CopyToClipboard";
import {
  heightUnitFormatter,
  heightValueFormatter,
} from "../../cells/Altitude";
import { getTimezoneOffsetLabel } from "../../../../helpers/date";

export default function PointInfo() {
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const heightUnitLabel = heightUnitFormatter(heightUnit);
  const timeZone = useAppSelector((state) => state.weather.timeZone);

  const windsAloft = useAppSelector((state) => state.weather.windsAloft);
  const weather = useAppSelector((state) => state.weather.weather);
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  const elevation = useAppSelector((state) => state.weather.elevation);
  if (!lat || !lon) throw new Error("lat or lon not defined!");
  if (!windsAloft || typeof windsAloft !== "object")
    throw new Error("RAP not defined");
  if (!timeZone) throw new Error("timeZone not defined");

  const altitudeInM = windsAloft.hours[0].altitudes[0].altitudeInM;

  const showOp40 =
    typeof windsAloft === "object" && windsAloft.source === "rucSounding";

  const aloftSource = (() => {
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

  const hourlySource = (() => {
    if (!weather || typeof weather !== "object") return;

    if ("byUnixTimestamp" in weather)
      return (
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          open-meteo.com / Best model
        </a>
      );

    return (
      <a
        href="https://www.weather.gov/documentation/services-web-api"
        target="_blank"
        rel="noopener noreferrer"
      >
        api.weather.gov
      </a>
    );
  })();

  return (
    <>
      {isInstalled() && (
        <DataListItem>
          <div>Coordinates</div>
          <div>
            <CopyToClipboard>{`${lat},${lon}`}</CopyToClipboard>
          </div>
        </DataListItem>
      )}
      <DataListItem>
        <div>Location elevation</div>
        <div>
          {Math.round(
            heightValueFormatter(elevation ?? -1, heightUnit),
          ).toLocaleString()}
          {heightUnitLabel}
        </div>
      </DataListItem>
      {showOp40 && (
        <DataListItem>
          <div>Winds aloft gridpoint elevation</div>
          <div>
            {Math.round(
              heightValueFormatter(altitudeInM, heightUnit),
            ).toLocaleString()}
            {heightUnitLabel}
          </div>
        </DataListItem>
      )}
      <DataListItem>
        <div>Winds aloft</div>
        <div>{aloftSource}</div>
      </DataListItem>
      <DataListItem>
        <div>Hourly weather</div>
        <div>{hourlySource}</div>
      </DataListItem>
      <DataListItem>
        <div>Time zone</div>
        <div>
          {timeZone} ({getTimezoneOffsetLabel(timeZone)})
        </div>
      </DataListItem>
    </>
  );
}
