import styled from "@emotion/styled/macro";
import { Feature } from "../weather/weatherSlice";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import RadarLayer from "../../map/RadarLayer";
import Linkify from "linkify-react";
import { linkifyOptions } from "../rap/extra/Discussion";
import { undoFixedWidthText } from "../../helpers/weather";
import OSMAttribution from "../../map/OSMAttribution";

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
  overflow-wrap: break-word;

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
            zoomSnap={undefined}
          >
            <MapController alert={alert} />
            <OSMAttribution />
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
    if (geoJsonRef.current)
      map.fitBounds(geoJsonRef.current.getBounds(), {
        padding: [25, 25],
      });
  }, [map, geoJsonRef]);

  // do something with map, in a useEffect hook, for example.

  return alert.geometry && <GeoJSON data={alert.geometry} ref={geoJsonRef} />;
};
