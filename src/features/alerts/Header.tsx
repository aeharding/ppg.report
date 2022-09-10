import styled from "@emotion/styled/macro";
import {
  faExclamationTriangle,
  faExternalLink,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { isAlertDangerous } from "../../helpers/weather";
import { TFRFeature } from "../../services/faa";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { isWeatherAlert } from "./alertsSlice";
import Times from "./Times";

const Container = styled.div<{ warning: boolean }>`
  position: sticky;
  top: 0;

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
  font-size: 0.8em;
  padding: 2px 4px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;

  align-self: flex-start;
  white-space: nowrap;
`;

interface HeaderProps {
  alert: WeatherAlertFeature | TFRFeature;
  aside: React.ReactNode;
}

export default function Header({ alert, aside }: HeaderProps) {
  return (
    <Container warning={isAlertDangerous(alert)}>
      <Headline>
        {isWeatherAlert(alert) ? (
          <WeatherHeadline alert={alert} />
        ) : (
          <TFRHeadline alert={alert} />
        )}
        <Aside>{aside}</Aside>
      </Headline>

      <Times alert={alert} />
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
