import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import RadarLayer from "../../map/RadarLayer";
import { linkifyOptions } from "../rap/extra/Discussion";
import { undoFixedWidthText } from "../../helpers/weather";
import OSMAttribution from "../../map/OSMAttribution";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import MapController from "./MapController";
import {
  AlertContainer,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "./shared";

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
