import styled from "@emotion/styled/macro";
import { Feature } from "../weather/weatherSlice";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import Header from "./Header";

// eslint-disable-next-line
import "leaflet/dist/leaflet.css";
import BaseLayer from "../../map/BaseLayer";
import RadarLayer from "../../map/RadarLayer";
import Linkify from "linkify-react";
import { linkifyOptions } from "../rap/extra/Discussion";

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

const StyledLinkify = styled(Linkify)`
  white-space: pre-line;

  margin: 1rem;
  font-size: 1rem;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 350px;
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
          <StyledMapContainer
            center={[41.683, -86.25]}
            zoom={13}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            trackResize={false}
            boxZoom={false}
            maxZoom={9}
          >
            <MapController alert={alert} />
            <BaseLayer />
            <RadarLayer />
          </StyledMapContainer>
        )}

        <Header alert={alert} aside={`${index + 1} of ${total}`} />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          {undoFixedWidthText(alert.properties.description)}
          {alert.properties.instruction
            ? `

            PRECAUTIONARY/PREPAREDNESS ACTIONS...

            ${undoFixedWidthText(alert.properties.instruction)}`
            : ""}
        </StyledLinkify>
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
export function undoFixedWidthText(text: string): string {
  return text.replace(/([^\n\\.])(\n)([^\n])/g, "$1 $3");
}
