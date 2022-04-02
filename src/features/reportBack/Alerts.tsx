import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { Feature } from "../weather/weatherSlice";

const Section = styled.div`
  background: black;
  margin: 0 -0.5rem;
  padding: 0.5rem;
  text-align: center;
`;

interface AlertsProps {
  alerts: Feature[];
}

export default function Alerts({ alerts }: AlertsProps) {
  return (
    <>
      <Section>{alerts.length} Alerts</Section>
      {alerts?.map((alert) => (
        <Alert alert={alert} />
      ))}
    </>
  );
}

const AlertContainer = styled.div`
  margin: 1rem 0;
`;

const Title = styled.div`
  font-size: 0.9em;
  ${outputP3ColorFromRGB([255, 255, 0])}
`;

interface AlertProps {
  alert: Feature;
}

function Alert({ alert }: AlertProps) {
  const awips = alert.properties.parameters.AWIPSidentifier[0];

  const product = awips.substring(0, 3);
  const site = awips.substring(3);

  return (
    <AlertContainer>
      <Title>
        <a
          href={`https://forecast.weather.gov/product.php?site=${site}&product=${product}&issuedby=${site}&format=txt`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {alert.properties.headline}
        </a>
      </Title>
    </AlertContainer>
  );
}
