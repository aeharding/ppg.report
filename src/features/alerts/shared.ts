import styled from "@emotion/styled";
import Linkify from "linkify-react";
import { MapContainer } from "react-leaflet";

export const AlertContainer = styled.div``;

export const Title = styled.div`
  font-size: 0.9em;
`;

export const Description = styled.div`
  opacity: 0.8;
  font-size: 0.9em;
  font-style: italic;
`;

export const StyledLinkify = styled(Linkify)`
  white-space: pre-line;
  overflow-wrap: break-word;

  margin: 1rem;
  font-size: 1rem;

  a {
    text-decoration: underline dashed rgba(255, 255, 255, 0.8);
    text-underline-offset: 4px;
    text-decoration-thickness: 0.8px;
  }
`;

export const StyledMapContainer = styled(MapContainer)`
  height: 350px;

  &,
  .leaflet-pane * {
    pointer-events: none !important;
  }
`;
