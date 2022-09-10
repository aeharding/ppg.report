import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { WeatherAlertFeature } from "../weatherSlice";
import { isTouchDevice } from "../../../helpers/device";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import { lazy, Suspense } from "react";
import Loading from "../../../shared/Loading";
import { TFRFeature } from "../../../services/faa";
import { isWeatherAlert } from "../../alerts/alertsSlice";

const Alerts = lazy(() => import("../../alerts/Alerts"));

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
  alerts: (WeatherAlertFeature | TFRFeature)[];
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
            content={getAlertName(alerts[0])}
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
                  <li key={index}>{getAlertName(alert)}</li>
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
    <BottomSheet
      openButton={renderAlertIcon()}
      title="Active Weather Alerts &amp; TFRs"
    >
      <Suspense fallback={<Loading />}>
        {alerts?.length ? <Alerts alerts={alerts} /> : ""}
      </Suspense>
    </BottomSheet>
  );
}

function getAlertName(
  alert: WeatherAlertFeature | TFRFeature
): string | undefined {
  return isWeatherAlert(alert)
    ? alert.properties.headline
    : `TFR ${alert.properties.coreNOTAMData.notam.number}`;
}
