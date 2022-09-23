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
import More from "../../shared/More";
import MyPosition from "../../map/MyPosition";

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
            <MyPosition />
          </StyledMapContainer>
        )}

        <Header alert={alert} index={index} total={total} />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          <Description>
            <More>
              <p>
                A Center Weather Advisory (CWA) is an unscheduled weather
                advisory for conditions meeting or approaching national
                in-flight advisory (SIGMET or G-AIRMET) criteria. It is
                primarily used by aircrews to anticipate and avoid adverse
                weather conditions in the en route and terminal environments.
              </p>
              <p>
                CWAs are valid for up to 2 hours and may include forecasts of
                conditions expected to begin within 2 hours of issuance. If
                conditions are expected to persist after the advisory's valid
                period, a statement to that effect is included in the last line
                of the text. Additional CWAs will subsequently be issued as
                appropriate.
              </p>
            </More>
          </Description>

          {alert.properties.cwaText}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}
