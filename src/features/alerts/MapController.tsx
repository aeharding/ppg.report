import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { TFRFeature } from "../../services/faa";

interface MapControllerProps {
  alert: WeatherAlertFeature | TFRFeature;
}

export default function MapController({ alert }: MapControllerProps) {
  const map = useMap();
  const geoJsonRef = useRef<any>();

  useEffect(() => {
    if (geoJsonRef.current)
      map.fitBounds(geoJsonRef.current.getBounds(), {
        padding: [25, 25],
      });
  }, [map, geoJsonRef]);

  // do something with map, in a useEffect hook, for example.

  return alert.geometry && <GeoJSON data={alert.geometry} ref={geoJsonRef} />;
}
