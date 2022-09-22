import styled from "@emotion/styled/macro";
import WeatherAlert from "./WeatherAlert";
import {
  Alert,
  isGAirmetAlert,
  isSigmetAlert,
  isTFRAlert,
  isWeatherAlert,
} from "./alertsSlice";
import TFRAlert from "./TFRAlert";
import SigmetAlert from "./SigmetAlert";
import CwaAlert from "./CwaAlert";
import GAirmetAlert from "./gairmet/GAirmetAlert";

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface AlertsProps {
  alerts: Alert[];
}

export default function Alerts({ alerts }: AlertsProps) {
  function renderAlert(alert: Alert, index: number) {
    if (isWeatherAlert(alert))
      return <WeatherAlert alert={alert} index={index} total={alerts.length} />;

    if (isTFRAlert(alert))
      return <TFRAlert alert={alert} index={index} total={alerts.length} />;

    if (isSigmetAlert(alert))
      return <SigmetAlert alert={alert} index={index} total={alerts.length} />;

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
