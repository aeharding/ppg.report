import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Feature } from "../weatherSlice";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useState } from "react";

import "react-spring-bottom-sheet/dist/style.css";
import AlertsBody from "../../reportBack/Alerts";

const Container = styled.div`
  margin-right: 0.5rem;
  white-space: nowrap;
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3em;
  margin-left: -0.25rem;
`;

const Header = styled.div`
  margin: 0 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
`;

interface AlertsProps {
  alerts: Feature[];
}

export default function Alerts({ alerts }: AlertsProps) {
  const icon = <WarningIcon icon={faExclamationTriangle} />;
  const [open, setOpen] = useState(false);

  function renderAlertIcon() {
    switch (alerts.length) {
      case 0:
        return <></>;
      case 1:
        return (
          <Tippy content={alerts[0].properties.headline} placement="bottom">
            <Container onClick={() => setOpen(true)}>{icon}</Container>
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
            <Container onClick={() => setOpen(true)}>
              {icon}
              <sup>x{alerts.length}</sup>
            </Container>
          </Tippy>
        );
    }
  }

  return (
    <>
      {renderAlertIcon()}
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={<Header>National Weather Service Alerts</Header>}
      >
        {alerts?.length ? <AlertsBody alerts={alerts} /> : ""}
      </BottomSheet>
    </>
  );
}
