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
            maxZoom={9}
            zoomSnap={undefined}
          >
            <MapController alert={alert} />
            <OSMAttribution />
            <BaseLayer />
          </StyledMapContainer>
        )}

        <Header alert={alert} index={index} total={total} includeYear />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          <Disclaimer>
            <strong>Important:</strong>{" "}
            <i>
              PPG.report may not show all active TFRs, and does not show
              sporting event TFRs. It is the pilot’s responsibility to check{" "}
              <a
                href="https://tfr.faa.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                tfr.faa.gov
              </a>{" "}
              before flying.
            </i>
          </Disclaimer>
          {undoFixedWidthText(alert.properties.coreNOTAMData.notam.text)}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}
