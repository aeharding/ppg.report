import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { Feature } from "../weather/weatherSlice";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { center, multiPolygon, polygon } from "@turf/turf";

interface AlertsProps {
  alerts: Feature[];
}

export default function Alerts({ alerts }: AlertsProps) {
  return (
    <>
      {alerts?.map((alert, index) => (
        <Alert alert={alert} key={index} />
      ))}
    </>
  );
}

const AlertContainer = styled.div`
  width: 100%;
  max-width: 500px;
  flex-shrink: 0;

  scroll-snap-align: center;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  padding: 1rem;
  background: #2e0000;
`;

const Title = styled.div`
  font-size: 0.9em;
  /* ${outputP3ColorFromRGB([255, 255, 0])} */
`;

const Pre = styled.pre`
  white-space: pre-line;
`;

const DarkMapContainer = styled(MapContainer)`
  height: 350px;
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
`;

interface AlertProps {
  alert: Feature;
}

function Alert({ alert }: AlertProps) {
  const awips = alert.properties.parameters.AWIPSidentifier[0];

  const product = awips.substring(0, 3);
  const site = awips.substring(3);

  return (
    <AlertContainer>
      <Title>
        <DarkMapContainer
          center={[41.683, -86.25]}
          zoom={13}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
        >
          <MapController alert={alert} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </DarkMapContainer>
        <Header
        // href={`https://forecast.weather.gov/product.php?site=${site}&product=${product}&issuedby=${site}&format=txt`}
        // target="_blank"
        // rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {alert.properties.headline}
        </Header>
        <Pre>{alert.properties.description}</Pre>
      </Title>
    </AlertContainer>
  );
}

const MapController = ({ alert }: AlertProps) => {
  const map = useMap();
  const geoJsonRef = useRef<any>();

  useEffect(() => {
    if (geoJsonRef.current) map.fitBounds(geoJsonRef.current.getBounds());
  }, [map, geoJsonRef]);

  // do something with map, in a useEffect hook, for example.

  return alert.geometry && <GeoJSON data={alert.geometry} ref={geoJsonRef} />;
};
