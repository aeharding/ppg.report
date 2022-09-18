import styled from "@emotion/styled/macro";
import WeatherAlert from "./WeatherAlert";
import { Alert, isTFRAlert, isWeatherAlert } from "./alertsSlice";
import TFRAlert from "./TFRAlert";
import AirSigmetAlert from "./AirSigmetAlert";

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

    return <AirSigmetAlert alert={alert} index={index} total={alerts.length} />;
  }
  return (
    <AlertsContainer>
      {alerts?.map((alert, index) => (
        <section key={index}>{renderAlert(alert, index)}</section>
      ))}
    </AlertsContainer>
  );
}
