import { useParams } from "react-router-dom";
import { DataListItem } from "../../../../DataList";
import { useAppSelector } from "../../../../hooks";
import { metersToFeet } from "../../cells/Altitude";

export default function PointInfo() {
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
          {Math.round(metersToFeet(elevation || -1)).toLocaleString()}ft
        </div>
      </DataListItem>
      <DataListItem>
        <div>Winds aloft gridpoint elevation</div>
        <div>{Math.round(metersToFeet(rapHeight)).toLocaleString()}ft</div>
      </DataListItem>
    </>
  );
}
