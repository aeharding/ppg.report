import { css } from "@emotion/react";
import { LatLngExpression } from "leaflet";
import { Circle } from "react-leaflet";
import { useParams } from "react-router";
import { outputP3ColorFromRGB } from "../helpers/colors";

export default function MyPosition() {
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");

  if (!lat || !lon) throw new Error("lat or lon not defined!");
  const myPosition: LatLngExpression = [+lat, +lon];

  return (
    <Circle
      center={myPosition}
      fillOpacity={1}
      radius={500}
      css={css`
        ${outputP3ColorFromRGB([0, 255, 0], "fill")}
        ${outputP3ColorFromRGB([0, 255, 0], "stroke")}
      `}
      pane="tooltipPane"
    />
  );
}
