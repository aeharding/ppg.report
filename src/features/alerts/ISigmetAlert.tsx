import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import { linkifyOptions } from "../rap/extra/discussion/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import MapController from "./MapController";
import RadarLayer from "../../map/RadarLayer";
import { ISigmetFeature } from "../../services/aviationWeather";
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
  alert: ISigmetFeature;
  index: number;
  total: number;
}

export default function SigmetAlert({ alert, index, total }: AlertProps) {
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
                International SIGMETs are defined within a specific FIR. Most
                FIRs are aligned with a country&apos;s airspace or a subset of
                that airspace. Ocean regions also have FIRs where SIGMETs are
                covered by adjacent countries. The US does issue international
                SIGMETs for Alaska and for oceanic areas off the east coast of
                the US, Gulf of Mexico and a large part of the central northern
                Pacific.
              </p>
              {typeInfo(alert.properties.rawSigmet.slice(0, 2))}
            </More>
          </Description>

          {alert.properties.rawSigmet}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}

function typeInfo(code: string) {
  switch (code) {
    case "WV":
      return (
        <p>
          The WV SIGMET provides information on volcanic ash and should be based
          on the Volcanic Ash Advisory.
        </p>
      );
    case "WC":
      return (
        <p>
          The WC SIGMET provides information on tropical cyclones (intensity 34
          knots or greater). WC SIGMET should be based on the Tropical Cyclone
          Advisory.
        </p>
      );
    case "WS":
      return (
        <p>
          The WS SIGMET provides information on phenomena other than tropical
          cyclones and volcanic ash.
        </p>
      );
  }
}
