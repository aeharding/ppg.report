import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Feature } from "../weatherSlice";
import { isTouchDevice } from "../../../helpers/device";
import Alerts from "../../alerts/Alerts";
import BottomSheet from "../../../bottomSheet/BottomSheet";

const Container = styled.div`
  margin-right: 0.5rem;
  white-space: nowrap;
  cursor: pointer;
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3em;
  margin-left: -0.25rem;
`;

interface AlertsProps {
  alerts: Feature[];
}

export default function AlertsIcon({ alerts }: AlertsProps) {
  const icon = <WarningIcon icon={faExclamationTriangle} />;

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
            <Container>{icon}</Container>
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
            <Container>
              {icon}
              <sup>x{alerts.length}</sup>
            </Container>
          </Tippy>
        );
    }
  }

  return (
    <BottomSheet openButton={renderAlertIcon()} title="Active Weather Alerts">
      {alerts?.length ? <Alerts alerts={alerts} /> : ""}
    </BottomSheet>
  );
}
