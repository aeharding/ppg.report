import Header from "./Header";

import BaseLayer from "../../map/BaseLayer";
import { linkifyOptions } from "../rap/extra/Discussion";
import OSMAttribution from "../../map/OSMAttribution";
import MapController from "./MapController";
import RadarLayer from "../../map/RadarLayer";
import { GAirmetFeature } from "../../services/aviationWeather";
import { capitalizeFirstLetter } from "../../helpers/string";
import { formatSeverity } from "../../helpers/aviationAlerts";
import {
  AlertContainer,
  Description,
  StyledLinkify,
  StyledMapContainer,
  Title,
} from "./shared";
interface AlertProps {
  alert: GAirmetFeature;
  index: number;
  total: number;
}

function formatFlightLevel(fl: string): string {
  if (fl === "SFC") return "surface";

  return `${(+fl * 100).toLocaleString()} MSL`;
}

export default function GAirmetAlert({ alert, index, total }: AlertProps) {
  function renderAlertDescription() {
    if (alert.properties.dueTo) return alert.properties.dueTo;

    switch (alert.properties.hazard) {
      case "TURB-LO":
      case "TURB-HI":
        return (
          <>
            {alert.properties.severity
              ? capitalizeFirstLetter(
                  formatSeverity(alert.properties.severity)!
                )
              : ""}{" "}
            non-convective turbulence exists in the{" "}
            {alert.properties.hazard === "TURB-HI" ? "upper" : "lower"}{" "}
            atmosphere{" "}
            {alert.properties.base && alert.properties.top
              ? `(${formatFlightLevel(
                  alert.properties.base
                )} to ${formatFlightLevel(alert.properties.top!)})`
              : ""}
            .
          </>
        );
      case "LLWS":
        return (
          <>
            <p>
              Non-convective wind shear below 2000 feet AGL, resulting in an air
              speed loss or gain of 20 knots or more.
            </p>
            <p>LLWS is particularly dangerous to paramotor pilots.</p>
            <p>
              {" "}
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
    }
  }
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
            A G-AIRMET is a graphical advisory of weather that may be hazardous
            to aircraft, but are less severe than SIGMETs. They are only valid
            at specific time "snapshots".
          </Description>

          {renderAlertDescription()}
        </StyledLinkify>
      </Title>
    </AlertContainer>
  );
}
