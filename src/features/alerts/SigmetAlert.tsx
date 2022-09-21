import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import { linkifyOptions } from "../rap/extra/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import MapController from "./MapController";
import RadarLayer from "../../map/RadarLayer";
import { SigmetFeature } from "../../services/aviationWeather";
import reactStringReplace from "react-string-replace";
import React from "react";
import {
  AlertContainer,
  Description,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "./shared";

interface AlertProps {
  alert: SigmetFeature;
  index: number;
  total: number;
}

const referToConvectiveOutlook =
  "REFER TO MOST RECENT ACUS01 KWNS FROM STORM PREDICTION CENTER FOR SYNOPSIS AND METEOROLOGICAL DETAILS.";

function replaceOccurrence(
  payload: string,
  match: string,
  to: React.ReactNode
) {
  return reactStringReplace(
    payload,
    new RegExp(`(${match.replaceAll(" ", "\\s+")})`),
    () => to
  );
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
          </StyledMapContainer>
        )}

        <Header alert={alert} index={index} total={total} />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          <Description>{formatSigmetDescription(alert)}</Description>

          {replaceOccurrence(
            alert.properties.rawAirSigmet,
            referToConvectiveOutlook,
            <a
              href="https://www.spc.noaa.gov/products/outlook/day1otlk.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              {referToConvectiveOutlook}
            </a>
          )}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}

export function formatSigmetDescription(alert: SigmetFeature) {
  if (
    alert.properties.hazard === "CONVECTIVE" &&
    alert.properties.airSigmetType === "OUTLOOK"
  ) {
    return (
      <>
        A Convective Outlook SIGMET is a weather advisory concerning predicted
        and/or possible future widespread convective weather (such as
        thunderstorms and/or tornadoes) significant to the safety of all
        aircraft. Outlooks are valid for four hours, and may be renewed. Before
        flying, pay special attention to radar and local weather observations.
      </>
    );
  }

  if (alert.properties.hazard === "CONVECTIVE")
    return (
      <>
        A Convective SIGMET (Significant Meteorological Information) is a
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
}
