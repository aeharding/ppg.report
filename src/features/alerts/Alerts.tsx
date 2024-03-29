import styled from "@emotion/styled";
import WeatherAlert from "./WeatherAlert";
import {
  Alert,
  isGAirmetAlert,
  isISigmetAlert,
  isSigmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "./alertsSlice";
import TFRAlert from "./TFRAlert";
import SigmetAlert from "./SigmetAlert";
import ISigmetAlert from "./ISigmetAlert";
import CwaAlert from "./CwaAlert";
import GAirmetAlert from "./gairmet/GAirmetAlert";
import React from "react";

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface AlertsProps {
  alerts: Alert[];
}

function Alerts({ alerts }: AlertsProps) {
  function renderAlert(alert: Alert, index: number) {
    if (isWeatherAlert(alert))
      return <WeatherAlert alert={alert} index={index} total={alerts.length} />;

    if (isTFRAlert(alert))
      return <TFRAlert alert={alert} index={index} total={alerts.length} />;

    if (isSigmetAlert(alert))
      return <SigmetAlert alert={alert} index={index} total={alerts.length} />;

    if (isISigmetAlert(alert))
      return <ISigmetAlert alert={alert} index={index} total={alerts.length} />;

    if (isGAirmetAlert(alert))
      return <GAirmetAlert alert={alert} index={index} total={alerts.length} />;

    return <CwaAlert alert={alert} index={index} total={alerts.length} />;
  }

  return (
    <AlertsContainer>
      {alerts?.map((alert, index) => (
        <section key={index}>{renderAlert(alert, index)}</section>
      ))}
    </AlertsContainer>
  );
}

export default React.memo(Alerts);
