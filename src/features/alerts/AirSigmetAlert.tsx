import { MapContainer } from "react-leaflet";

import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import Linkify from "linkify-react";
import { linkifyOptions } from "../rap/extra/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import styled from "@emotion/styled/macro";
import MapController from "./MapController";
import { AirSigmetFeature } from "../../services/aviationWeather";
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
  alert: AirSigmetFeature;
  index: number;
  total: number;
}

export default function AirSigmetAlert({ alert, index, total }: AlertProps) {
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
          <Description>{formatAirSigmetDescription(alert)}</Description>

          {alert.properties.rawAirSigmet}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}

export function formatAirSigmetDescription(alert: AirSigmetFeature) {
  if (alert.properties.hazard === "CONVECTIVE")
    return (
      <>
        A convective SIGMET (Significant Meteorological Information) is a
        weather advisory concerning convective weather significant to the safety
        of all aircraft. Convective SIGMETs are issued for tornadoes, lines of
        thunderstorms, embedded thunderstorms of any intensity level, areas of
        thunderstorms greater than or equal to VIP level 4 with an area coverage
        of 4/10 (40%) or more, and hail 3/4 inch or greater.
      </>
    );
  if (alert.properties.airSigmetType === "SIGMET")
    return (
      <>
        A SIGMET (Significant Meteorological Information) advises of weather
        that is potentially hazardous to all aircraft.
      </>
    );
  if (alert.properties.airSigmetType === "AIRMET")
    return (
      <>
        AIRMETS (Airmen's Meteorological Information) are in-flight weather
        advisories issued only to amend the Aviation Surface Forecast, Aviation
        Cloud Forecast, or area forecast concerning weather phenomena which are
        of operational interest to all aircraft and especially hazardous to
        paramotor pilots. AIRMETs concern weather of less severity than that
        covered by SIGMETs or Convective SIGMETs. AIRMETs cover moderate icing,
        moderate turbulence, sustained winds of 30 knots or more at the surface,
        widespread areas of ceilings less than 1,000 feet and/or visibility less
        than 3 miles, and extensive mountain obscurement.
      </>
    );
}
