import { TileLayer } from "react-leaflet";

export default function RadarLayer() {
  return (
    <TileLayer
      url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
      opacity={0.4}
    />
  );
}
