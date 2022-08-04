import styled from "@emotion/styled/macro";
import { Feature } from "../weather/weatherSlice";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import Header from "./Header";

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface AlertsProps {
  alerts: Feature[];
}

export default function Alerts({ alerts }: AlertsProps) {
  return (
    <AlertsContainer>
      {alerts?.map((alert, index) => (
        <Alert alert={alert} key={index} index={index} total={alerts.length} />
      ))}
    </AlertsContainer>
  );
}

const AlertContainer = styled.div``;

const Title = styled.div`
  font-size: 0.9em;
`;

const Pre = styled.pre`
  white-space: pre-line;

  margin: 5px;
`;

const DarkMapContainer = styled(MapContainer)`
  height: 350px;
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  pointer-events: none;
`;

interface AlertProps {
  alert: Feature;
  index: number;
  total: number;
}

function Alert({ alert, index, total }: AlertProps) {
  return (
    <AlertContainer>
      <Title>
        {alert.geometry && (
          <DarkMapContainer
            center={[41.683, -86.25]}
            zoom={13}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            trackResize={false}
            boxZoom={false}
          >
            <MapController alert={alert} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </DarkMapContainer>
        )}

        <Header alert={alert} aside={`${index + 1} of ${total}`} />

        <Pre>{formatText(alert.properties.description)}</Pre>
        {alert.properties.instruction && (
          <Pre>{formatText(alert.properties.instruction)}</Pre>
        )}
      </Title>
    </AlertContainer>
  );
}

interface MapControllerProps {
  alert: Feature;
}

const MapController = ({ alert }: MapControllerProps) => {
  const map = useMap();
  const geoJsonRef = useRef<any>();

  useEffect(() => {
    if (geoJsonRef.current) map.fitBounds(geoJsonRef.current.getBounds());
  }, [map, geoJsonRef]);

  // do something with map, in a useEffect hook, for example.

  return alert.geometry && <GeoJSON data={alert.geometry} ref={geoJsonRef} />;
};

/**
 * Try to format out some of the random line breaks the
 * National Weather Service includes (for fixed width displays)
 * that doesn't work well for mobile
 *
 * Try to preserve all sensible line breaks
 */
function formatText(text: string): string {
  return text.replace(/([^\n\\.])(\n)([^\n])/g, "$1 $3");
}
