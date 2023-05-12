import styled from "@emotion/styled";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { useAppSelector } from "../../hooks";

const Failed = styled.div`
  ${outputP3ColorFromRGB([255, 0, 0])}
`;

export default function Errors() {
  const weatherAlerts = useAppSelector((state) => state.weather.alerts);
  const aviationAlerts = useAppSelector(
    (state) => state.weather.aviationAlerts
  );
  const tfrs = useAppSelector((state) => state.faa.tfrs);
  const weather = useAppSelector((state) => state.weather.weather);

  return (
    <>
      {weather === "failed" ? (
        <Failed>
          <FontAwesomeIcon icon={faExclamationTriangle} /> NWS hourly weather
          failed to load.
        </Failed>
      ) : (
        ""
      )}
      {weatherAlerts === "failed" ? (
        <Failed>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Weather alerts failed
          to load.
        </Failed>
      ) : (
        ""
      )}
      {tfrs === "failed" ? (
        <Failed>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Temporary flight
          restrictions (TFRs) failed to load.
        </Failed>
      ) : (
        ""
      )}
      {aviationAlerts === "failed" ? (
        <Failed>
          <FontAwesomeIcon icon={faExclamationTriangle} /> SIGMETs, G‑AIRMETs
          and CWAs failed to load.
        </Failed>
      ) : (
        ""
      )}
    </>
  );
}
