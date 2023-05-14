import { useParams } from "react-router-dom";
import { DataListItem } from "../../../../DataList";
import { useAppSelector } from "../../../../hooks";
import {
  heightUnitFormatter,
  heightValueFormatter,
  metersToFeet,
} from "../../cells/Altitude";
import { HeightUnit } from "../../../user/userSlice";

export default function PointInfo() {
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const heightUnitLabel = heightUnitFormatter(heightUnit);

  const rap = useAppSelector((state) => state.rap.rap);
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
  const elevation = useAppSelector((state) => state.weather.elevation);
  if (!lat || !lon) throw new Error("lat or lon not defined!");
  if (!rap || typeof rap !== "object") throw new Error("RAP not defined");

  const rapHeight = rap[0].data[0].height;

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
      <DataListItem>
        <div>Winds aloft gridpoint elevation</div>
        <div>
          {Math.round(
            heightValueFormatter(rapHeight, heightUnit)
          ).toLocaleString()}
          {heightUnitLabel}
        </div>
      </DataListItem>
    </>
  );
}
