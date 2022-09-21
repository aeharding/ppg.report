import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import { linkifyOptions } from "../rap/extra/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import MapController from "./MapController";
import { CwaFeature } from "../../services/aviationWeather";
import RadarLayer from "../../map/RadarLayer";
import {
  AlertContainer,
  Description,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "./shared";

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
