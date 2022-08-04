import styled from "@emotion/styled/macro";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Feature } from "../weatherSlice";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useState } from "react";

import "react-spring-bottom-sheet/dist/style.css";
import AlertsBody from "../../alerts/Alerts";
import { isTouchDevice } from "../../../helpers/device";

const Container = styled.div`
  margin-right: 0.5rem;
  white-space: nowrap;
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3em;
  margin-left: -0.25rem;
`;

const Header = styled.div`
  margin: 0.75rem 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
`;

const CloseContainer = styled.div`
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 2.5rem;

  margin-left: auto;
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
          <Tippy
            disabled={isTouchDevice()}
            content={alerts[0].properties.headline}
            placement="bottom"
          >
            <Container onClick={() => setOpen(true)}>{icon}</Container>
          </Tippy>
        );
      default:
        return (
          <Tippy
            disabled={isTouchDevice()}
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
        header={
          <Header>
            Weather Service Alerts
            <CloseContainer onClick={() => setOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseContainer>
          </Header>
        }
        snapPoints={({ maxHeight, minHeight }) => [
          Math.min(maxHeight - maxHeight / 10, minHeight),
        ]}
        expandOnContentDrag
        initialFocusRef={false}
      >
        {alerts?.length ? <AlertsBody alerts={alerts} /> : ""}
      </BottomSheet>
    </>
  );
}
