import { MapContainer } from "react-leaflet";

import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import RadarLayer from "../../map/RadarLayer";
import Linkify from "linkify-react";
import { linkifyOptions } from "../rap/extra/Discussion";
import { undoFixedWidthText } from "../../helpers/weather";
import OSMAttribution from "../../map/OSMAttribution";
import styled from "@emotion/styled/macro";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import MapController from "./MapController";

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
  alert: WeatherAlertFeature;
  index: number;
  total: number;
}

export default function WeatherAlert({ alert, index, total }: AlertProps) {
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

        <Header alert={alert} index={index} total={total} />

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
