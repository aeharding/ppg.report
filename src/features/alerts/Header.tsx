import styled from "@emotion/styled";
import { faExternalLink } from "@fortawesome/pro-regular-svg-icons";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import { getAviationAlertName } from "../../helpers/aviationAlerts";
import useDebounce from "../../helpers/useDebounce";
import { findRelatedAlerts, isAlertDangerous } from "../../helpers/weather";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AviationAlertFeature } from "../../services/aviationWeather";
import { TFRFeature } from "../../services/faa";
import { WeatherAlertFeature } from "../../services/nwsWeather";
import { readAlert } from "../user/userSlice";
import {
  Alert,
  isGAirmetAlert,
  isISigmetAlert,
  isSigmetOutlookAlert,
  isSigmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "./alertsSlice";
import Times from "./Times";
import UnreadIndicator from "./UnreadIndicator";
import { addHours, format, roundToNearestHours } from "date-fns";
import { tz } from "@date-fns/tz";

const Container = styled.div<{ warning: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;

  padding: 1rem;
  background: ${({ warning }) => (warning ? "#6e0101" : "#6e6701")};
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3rem;
`;

const Headline = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const NameLine = styled.div`
  margin-left: 0.75rem;
  line-height: 1.1;
`;

const Name = styled.div`
  font-size: 1.2rem;
  font-weight: 300;
  margin-right: 1.5rem;
  white-space: nowrap;
`;

const Issuer = styled.div`
  font-size: 0.85em;
`;

const EventName = styled.span`
  white-space: normal;
`;

const Link = styled.a`
  display: flex;

  &:hover {
    text-decoration: none;
  }
`;

const OpenIcon = styled(FontAwesomeIcon)`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: 5px;
  margin-left: 0.25rem;
`;

const Aside = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AlertOrderContainer = styled.div`
  font-size: 0.8em;
  padding: 2px 4px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;

  align-self: flex-start;
  white-space: nowrap;
`;

interface HeaderProps {
  alert: Alert;
  index: number;
  total: number;
  includeYear?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  alert,
  index,
  total,
  includeYear,
  children,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView({ threshold: 1 });
  const inViewDebounced = useDebounce(inView, 1000);
  const aviationAlerts = useAppSelector(
    (state) => state.weather.aviationAlerts,
  );

  useEffect(() => {
    if (!inViewDebounced) return;

    dispatch(readAlert(alert));

    if (typeof aviationAlerts !== "object") return;

    findRelatedAlerts(alert, aviationAlerts).forEach((relatedAlert) =>
      dispatch(readAlert(relatedAlert)),
    );
  }, [inViewDebounced, dispatch, alert, aviationAlerts]);

  function renderHeadline(alert: Alert) {
    if (isWeatherAlert(alert)) return <WeatherHeadline alert={alert} />;

    if (isTFRAlert(alert)) return <TFRHeadline alert={alert} />;

    return <AirSigmetHeadline alert={alert} />;
  }

  const noEndLabel = (() => {
    if (isWeatherAlert(alert)) return "Until further notice";

    return "Permanent";
  })();

  return (
    <Container warning={isAlertDangerous(alert)} ref={ref}>
      <Headline>
        {renderHeadline(alert)}

        <Aside>
          <UnreadIndicator alert={alert} />

          <AlertOrderContainer>
            {index + 1} of {total}
          </AlertOrderContainer>
        </Aside>
      </Headline>

      <Times
        alert={alert}
        includeYear={!!includeYear}
        noEndLabel={noEndLabel}
      />

      {children}
    </Container>
  );
}

function WeatherHeadline({ alert }: { alert: WeatherAlertFeature }) {
  const awips = alert.properties.parameters.AWIPSidentifier[0];

  const product = awips.substring(0, 3);
  const site = awips.substring(3);

  return (
    <>
      <WarningIcon icon={faExclamationTriangle} />{" "}
      <Link
        href={`https://forecast.weather.gov/product.php?site=${site}&product=${product}&issuedby=${site}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <NameLine>
          <Issuer>National Weather Service</Issuer>
          <Name>
            <EventName>{alert.properties.event}</EventName>&nbsp;
            <OpenIcon icon={faExternalLink} />
          </Name>
        </NameLine>
      </Link>
    </>
  );
}

function TFRHeadline({ alert }: { alert: TFRFeature }) {
  return (
    <>
      <WarningIcon icon={faExclamationTriangle} />{" "}
      <Link
        href={`https://tfr.faa.gov/save_pages/detail_${alert.properties.coreNOTAMData.notam.number.replace(
          /\//g,
          "_",
        )}.html`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <NameLine>
          <Issuer>Federal Aviation Administration</Issuer>
          <Name>
            <EventName>
              TFR {alert.properties.coreNOTAMData.notam.classification}{" "}
              {alert.properties.coreNOTAMData.notam.number}
            </EventName>
            &nbsp;
            <OpenIcon icon={faExternalLink} />
          </Name>
        </NameLine>
      </Link>
    </>
  );
}

function AirSigmetHeadline({ alert }: { alert: AviationAlertFeature }) {
  const { location } = useParams<"location">();
  const [lat, lon] = location!.split(",");

  // https://www.aviationweather.gov/cwamis/help?page=inter
  function buildUrl() {
    if (isSigmetOutlookAlert(alert))
      // https://aviationweather.gov/gfa/?tab=obs
      return `https://aviationweather.gov/gfa/?tab=sigmet&center=${lat},${lon}&zoom=5&time=${format(addHours(roundToNearestHours(alert.properties.validTimeFrom), 2), "HH", { in: tz("utc") })}z&level=sfc&basemap=esriDark&sigmetoutlook=1`;

    if (isSigmetAlert(alert))
      return `https://aviationweather.gov/gfa/?tab=sigmet&center=${lat},${lon}&zoom=6&level=sfc&basemap=esriDark`;

    if (isISigmetAlert(alert))
      return `https://aviationweather.gov/gfa/?tab=sigmet&center=${lat},${lon}&zoom=6&level=sfc&basemap=esriDark`;

    if (isGAirmetAlert(alert))
      return `https://aviationweather.gov/gfa/?tab=gairmet&center=${lat},${lon}&zoom=5&level=sfc&basemap=esriDark&time=${alert.properties.forecast}&gairmettype=${alert.properties.hazard}&time=30%2F${format(roundToNearestHours(alert.properties.validTime), "HH", { in: tz("utc") })}z`;

    return `https://aviationweather.gov/gfa/?tab=cwa&center=${lat},${lon}&zoom=6&level=sfc&basemap=esriDark`;
  }

  return (
    <>
      <WarningIcon icon={faExclamationTriangle} />{" "}
      <Link href={buildUrl()} target="_blank" rel="noopener noreferrer">
        <NameLine>
          <Issuer>Aviation Weather Center</Issuer>
          <Name>
            <EventName>{getAviationAlertName(alert)}</EventName>
            &nbsp;
            <OpenIcon icon={faExternalLink} />
          </Name>
        </NameLine>
      </Link>
    </>
  );
}
