import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Feature } from "../weatherSlice";
import { lazy, Suspense, useState } from "react";
import { isTouchDevice } from "../../../helpers/device";

import "react-spring-bottom-sheet/dist/style.css";

const AlertsBottomSheet = lazy(() => import("./AlertsBottomSheet"));

const Container = styled.div`
  margin-right: 0.5rem;
  white-space: nowrap;
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

      <Suspense fallback>
        <AlertsBottomSheet alerts={alerts} open={open} setOpen={setOpen} />
      </Suspense>
    </>
  );
}
