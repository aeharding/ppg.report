import { MapContainer } from "react-leaflet";

import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import Linkify from "linkify-react";
import { linkifyOptions } from "../rap/extra/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import styled from "@emotion/styled/macro";
import MapController from "./MapController";
import { CwaFeature } from "../../services/aviationWeather";
import RadarLayer from "../../map/RadarLayer";

const AlertContainer = styled.div``;

const Title = styled.div`
  font-size: 0.9em;
`;

const Description = styled.p`
  opacity: 0.8;
  font-size: 0.9em;
  font-style: italic;
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
  alert: CwaFeature;
  index: number;
  total: number;
}

export default function CwaAlert({ alert, index, total }: AlertProps) {
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
            maxZoom={13}
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
          <Description>
            A Center Weather Advisory (CWA) is an unscheduled weather advisory
            for conditions meeting or approaching national in-flight advisory
            (WA, WS, or WST) criteria. It is primarily used by aircrews to
            anticipate and avoid adverse weather conditions in the en route and
            terminal environments.{" "}
          </Description>

          {alert.properties.cwaText}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}
