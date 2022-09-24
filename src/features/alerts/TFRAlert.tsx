import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import { linkifyOptions } from "../rap/extra/Discussion";
import { undoFixedWidthText } from "../../helpers/weather";
import OSMAttribution from "../../map/OSMAttribution";
import styled from "@emotion/styled/macro";
import MapController from "./MapController";
import { TFRFeature } from "../../services/faa";
import {
  AlertContainer,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "./shared";
import More from "../../shared/More";
import MyPosition from "../../map/MyPosition";

const Disclaimer = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

interface AlertProps {
  alert: TFRFeature;
  index: number;
  total: number;
}

export default function TFRAlert({ alert, index, total }: AlertProps) {
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
            maxZoom={11}
            zoomSnap={undefined}
          >
            <MapController alert={alert} />
            <OSMAttribution />
            <BaseLayer />
            <MyPosition />
          </StyledMapContainer>
        )}

        <Header alert={alert} index={index} total={total} includeYear />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          <Disclaimer>
            <More>
              <p>
                PPG.report may not show all active TFRs, and does not show
                sporting event TFRs. It is the pilot’s responsibility to check{" "}
                <a
                  href="https://tfr.faa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tfr.faa.gov
                </a>{" "}
                before flying. TFRs are shown within 20 miles from your selected
                location.
              </p>
              <p>
                A Temporary Flight Restriction (TFR) is a type of Notices to
                Airmen (NOTAM). A TFR defines an area restricted to air travel
                due to a hazardous condition, a special event, or a general
                warning for the entire FAA airspace. The text of the actual TFR
                contains the fine points of the restriction.
              </p>
            </More>
          </Disclaimer>

          {undoFixedWidthText(alert.properties.coreNOTAMData.notam.text)}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}
