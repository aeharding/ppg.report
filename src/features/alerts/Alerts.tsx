import styled from "@emotion/styled/macro";
import { WeatherAlertFeature } from "../weather/weatherSlice";
import { TFRFeature } from "../../services/faa";
import WeatherAlert from "./WeatherAlert";
import { isWeatherAlert } from "./alertsSlice";
import TFRAlert from "./TFRAlert";

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface AlertsProps {
  alerts: (WeatherAlertFeature | TFRFeature)[];
}

export default function Alerts({ alerts }: AlertsProps) {
  return (
    <AlertsContainer>
      {alerts?.map((alert, index) => (
        <section key={index}>
          {isWeatherAlert(alert) ? (
            <WeatherAlert alert={alert} index={index} total={alerts.length} />
          ) : (
            <TFRAlert alert={alert} index={index} total={alerts.length} />
          )}
        </section>
      ))}
    </AlertsContainer>
  );
}
