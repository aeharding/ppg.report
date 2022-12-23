import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import { Icon, marker } from "leaflet";
import { Alert } from "./alertsSlice";
import { getAlertId } from "../../helpers/alert";

const iconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 425.963 425.963" viewBox="79.3 0 267.4 426"><path d="M213 0C139 0 79 60 79 133c0 49 22 112 66 189a1051 1051 0 0 0 68 104l4-2c1-1 33-49 65-109 43-81 65-142 65-182C347 60 287 0 213 0zm62 137a62 62 0 1 1-124-1 62 62 0 0 1 124 1z" fill="red" /></svg>';

const iconUrl = "data:image/svg+xml;base64," + btoa(iconSvg);

interface MapControllerProps {
  alert: Alert;
  padding?: number;
}

export default function MapController({ alert, padding }: MapControllerProps) {
  const map = useMap();
  const geoJsonRef = useRef<any>();

  useEffect(() => {
    if (geoJsonRef.current)
      map.fitBounds(geoJsonRef.current.getBounds(), {
        padding: [padding ?? 25, padding ?? 25],
      });
  }, [map, geoJsonRef, padding]);

  // do something with map, in a useEffect hook, for example.

  const icon = new Icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  return (
    alert.geometry && (
      <GeoJSON
        key={getAlertId(alert)}
        data={alert.geometry}
        ref={geoJsonRef}
        pointToLayer={(feature, latLng) => marker(latLng, { icon })}
      />
    )
  );
}
