import { Rap } from "gsl-parser";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { metersToFeet } from "./cells/Altitude";

interface PointInfoProps {
  rap: Rap[];
}

export default function PointInfo({ rap }: PointInfoProps) {
  const { lat, lon } = useParams();
  const elevation = useAppSelector((state) => state.weather.elevation);
  if (!lat || !lon) throw new Error("lat or lon not defined!");

  const rapHeight = rap[0].data[0].height;

  return (
    <>
      <div>
        <a
          href={`http://www.openstreetmap.org/?mlat=${rap[0].lat}&mlon=${-rap[0]
            .lon}&zoom=12&layers=M`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {rap[0].headerLine.slice(0, -1)}
        </a>
      </div>
      <div>
        Location elevation:{" "}
        {Math.round(metersToFeet(elevation || -1)).toLocaleString()}ft.
        Gridpoint elevation:{" "}
        {Math.round(metersToFeet(rapHeight)).toLocaleString()}ft
      </div>
    </>
  );
}
