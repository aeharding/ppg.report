import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Feature } from "../weatherSlice";

const Container = styled.div`
  margin-right: 0.5rem;
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3em;
  margin-left: -0.25rem;
`;

interface AlertsProps {
  alerts: Feature[];
}

export default function Alerts({ alerts }: AlertsProps) {
  const icon = <WarningIcon icon={faExclamationTriangle} />;

  switch (alerts.length) {
    case 0:
      return <></>;
    case 1:
      return (
        <Tippy content={alerts[0].properties.headline} placement="bottom">
          <Container>{icon}</Container>
        </Tippy>
      );
    default:
      return (
        <Tippy
          content={
            <ol>
              {alerts.map((alert, index) => (
                <li key={index}>{alert.properties.headline}</li>
              ))}
            </ol>
          }
          placement="bottom"
        >
          <Container>
            {icon}
            <sup>x{alerts.length}</sup>
          </Container>
        </Tippy>
      );
  }
}
