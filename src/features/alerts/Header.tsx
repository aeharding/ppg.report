import styled from "@emotion/styled/macro";
import { faExternalLink } from "@fortawesome/pro-regular-svg-icons";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useDebounce from "../../helpers/useDebounce";
import { isAlertDangerous } from "../../helpers/weather";
import { useAppDispatch } from "../../hooks";
import {
  AirSigmetFeature,
  getAirSigmetName,
} from "../../services/aviationWeather";
import { TFRFeature } from "../../services/faa";
import { readAlert } from "../user/userSlice";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { Alert, isTFRAlert, isWeatherAlert } from "./alertsSlice";
import Times from "./Times";
import UnreadIndicator from "./UnreadIndicator";

const Container = styled.div<{ warning: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1;

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

const Name = styled.div`
  font-size: 1.2rem;
  margin-left: 0.75rem;
  font-weight: 300;
  margin-right: 1.5rem;
  line-height: 1.1;
  white-space: nowrap;
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
}

export default function Header({
  alert,
  index,
  total,
  includeYear,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView({ threshold: 1 });
  const inViewDebounced = useDebounce(inView, 1000);

  useEffect(() => {
    if (!inViewDebounced) return;

    dispatch(readAlert(alert));
  }, [inViewDebounced, dispatch, alert]);

  function renderHeadline(alert: Alert) {
    if (isWeatherAlert(alert)) return <WeatherHeadline alert={alert} />;

    if (isTFRAlert(alert)) return <TFRHeadline alert={alert} />;

    return <AirSigmetHeadline alert={alert} />;
  }

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

      <Times alert={alert} includeYear={!!includeYear} />
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
        <Name>
          <EventName>{alert.properties.event}</EventName>&nbsp;
          <OpenIcon icon={faExternalLink} />
        </Name>
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
          "_"
        )}.html`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Name>
          <EventName>
            TFR {alert.properties.coreNOTAMData.notam.classification}{" "}
            {alert.properties.coreNOTAMData.notam.number}
          </EventName>
          &nbsp;
          <OpenIcon icon={faExternalLink} />
        </Name>
      </Link>
    </>
  );
}

function AirSigmetHeadline({ alert }: { alert: AirSigmetFeature }) {
  return (
    <>
      <WarningIcon icon={faExclamationTriangle} />{" "}
      <Link
        href="https://beta.aviationweather.gov/gfa"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Name>
          <EventName>{getAirSigmetName(alert)}</EventName>
          &nbsp;
          <OpenIcon icon={faExternalLink} />
        </Name>
      </Link>
    </>
  );
}
