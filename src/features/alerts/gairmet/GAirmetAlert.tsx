import Header from "../Header";

import BaseLayer from "../../../map/BaseLayer";
import { linkifyOptions } from "../../rap/extra/Discussion";
import OSMAttribution from "../../../map/OSMAttribution";
import MapController from "../MapController";
import RadarLayer from "../../../map/RadarLayer";
import { GAirmetFeature } from "../../../services/aviationWeather";
import {
  AlertContainer,
  Description,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "../shared";
import More from "../../../shared/More";
import { useAppSelector } from "../../../hooks";
import { findRelatedAlerts } from "../../../helpers/weather";
import DescriptionText from "./Description";
import { useState } from "react";
import styled from "@emotion/styled/macro";
import { formatInTimeZone } from "date-fns-tz";
import { getAlertEnd, getAlertStart } from "../alertsSlice";
import { timeZoneSelector } from "../../weather/weatherSlice";
import { css } from "@emotion/react/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import MyPosition from "../../../map/MyPosition";

const MapGeometrySelector = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);

  pointer-events: auto;

  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  margin: 0.5rem;

  backdrop-filter: blur(4px);
`;

const GeometryTime = styled.div<{ selected: boolean }>`
  ${({ selected }) =>
    selected &&
    css`
      ${outputP3ColorFromRGB([0, 255, 0])}
    `}
`;

const Hr = styled.hr`
  width: 50px;
`;

interface AlertProps {
  alert: GAirmetFeature;
  index: number;
  total: number;
}

export default function GAirmetAlert({ alert, index, total }: AlertProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  const aviationAlerts = useAppSelector(
    (state) => state.weather.aviationAlerts
  );

  if (!timeZone) throw new Error("timeZone must be defined");

  if (typeof aviationAlerts !== "object")
    throw new Error("Aviation alerts must be defined for this page");

  const relatedAlerts = findRelatedAlerts(alert, aviationAlerts);
  const [focusedAlert, setFocusedAlert] = useState(alert);

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
            <MapController
              alert={focusedAlert}
              padding={relatedAlerts.length ? 45 : undefined}
            />
            <OSMAttribution />
            <BaseLayer />
            <RadarLayer />
            {relatedAlerts.length > 1 ? (
              <MapGeometrySelector>
                {relatedAlerts.map((relatedAlert) => (
                  <GeometryTime
                    onClick={() => setFocusedAlert(relatedAlert)}
                    selected={relatedAlert.id === focusedAlert.id}
                  >
                    {formatInTimeZone(
                      getAlertStart(relatedAlert),
                      timeZone,
                      "haaa"
                    )}
                    –
                    {formatInTimeZone(
                      getAlertEnd(relatedAlert)!,
                      timeZone,
                      "haaa"
                    )}
                  </GeometryTime>
                ))}
              </MapGeometrySelector>
            ) : (
              ""
            )}
            <MyPosition />
          </StyledMapContainer>
        )}

        <Header alert={alert} index={index} total={total} />

        <StyledLinkify tagName="div" options={linkifyOptions}>
          <Description>
            <More>
              {getHazardHelp(alert.properties.hazard)}
              <Hr />
              <p>
                A G-AIRMET is a graphical advisory of weather that may be
                hazardous to aircraft, but are less severe than SIGMETs. They
                are only valid at specific time "snapshots". Forecasters create
                graphical objects depicting the areas and attributes of AIRMET
                hazards.
              </p>
              <p>
                G-AIRMETs are issued at discrete times 3 hours apart for a
                period of up to 12 hours into the future (00, 03, 06, 09, and 12
                hours). They are issued at 03:00, 09:00, 15:00 and 21:00 UTC
                (with updates issued as necessary). AIRMET are issued by the AWC
                for the lower 48 states and adjacent coastal waters.
              </p>
            </More>
          </Description>

          <DescriptionText alerts={relatedAlerts} />
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}

/**
 * Shamelessly stolen from https://www.aviationweather.gov/gairmet/help
 */
function getHazardHelp(
  hazard: GAirmetFeature["properties"]["hazard"]
): React.ReactNode {
  switch (hazard) {
    case "IFR":
      return (
        <>
          <p>
            An IFR G-AIRMET is issued when there are areas of cloud ceilings
            with bases less than 1,000 feet AGL and/or areas of surface
            visibilities below 3 statute miles, including the weather causing
            the visibility restriction. The cause of the visibility restriction
            includes only widespread sand/dust storm, PCPN (precipitation), FU
            HZ (smoke haze), BR (mist), FG (fog), and/or BLSN (blowing snow).
          </p>

          <p>
            <a
              href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-103/subpart-B/section-103.23"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ultralight visibility and cloud clearance requirements (FAR
              103.23)
            </a>{" "}
            may restrict or forbid flying. Stay on the ground if conditions look
            marginal.
          </p>
        </>
      );
    case "FZLVL":
      return (
        <p>
          Freezing level is defined as the lowest freezing level above the
          ground or at the SFC as appropriate. Freezing level information is
          included after AIRMETs for moderate icing or statements indicating
          that no significant icing is expected. Freezing levels are delineated
          using high altitude VOR locations describing the location of the
          lowest freezing level above the ground or SFC as appropriate. Freezing
          levels above the ground are delineated at 4000 feet intervals AMSL.
          Multiple freezing levels above the ground are delineated by high
          altitude and low altitude VOR locations. The range of freezing levels
          across the forecast area is also included.
        </p>
      );
    case "ICE":
      return (
        <p>
          Areas of moderate airframe icing, other than convectively induced,
          including the areal extent.
        </p>
      );
    case "LLWS":
      return (
        <>
          <p>
            LLWS is defined as wind shear below 2,000 feet AGL, other than
            convectively induced, resulting in an air speed loss or gain of 20
            knots or more. LLWS potential information is included after AIRMETs
            for moderate turbulence and/or sustained surface winds greater than
            30 knots or statements indicating no significant turbulence is
            expected.
          </p>
          <p>
            LLWS is particularly dangerous to paramotor pilots.{" "}
            <a
              href="https://www.weather.gov/zme/safety_llws"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about LLWS on weather.gov.
            </a>
          </p>
        </>
      );
    case "TURB-HI":
    case "TURB-LO":
      return (
        <p>
          Areas of moderate turbulence, other than convectively induced,
          including the vertical extent.
        </p>
      );
    case "SFC_WND":
      return (
        <p>
          Areas of sustained surface winds greater than 30 knots. The direction
          and speed of the wind are <strong>not</strong> depicted; only the area
          where sustained surface winds greater than 30 knots will occur.
        </p>
      );
    case "MT_OBSC":
      return (
        <p>
          Areas of widespread mountain obscuration where VMC cannot be
          maintained, including the weather causing the obscuration. The weather
          causing the obscuration includes only CLDS (clouds), PCPN
          (precipitation), FU (smoke), HZ (haze), BR (mist), and/or FG (fog).
        </p>
      );
  }
}
