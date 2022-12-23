import styled from "@emotion/styled/macro";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { timeZoneSelector } from "../weatherSlice";
import { isTouchDevice } from "../../../helpers/device";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import { lazy, Suspense } from "react";
import Loading from "../../../shared/Loading";
import {
  Alert,
  hiddenAlertsForLocationSelector,
  isTFRAlert,
  isWeatherAlert,
} from "../../alerts/alertsSlice";
import { isAlertDangerous } from "../../../helpers/weather";
import { HeaderType } from "../WeatherHeader";
import { css } from "@emotion/react/macro";
import { formatInTimeZone } from "date-fns-tz";
import { useAppSelector } from "../../../hooks";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import JumpActions from "../../alerts/JumpActions";
import { getAviationAlertName } from "../../../helpers/aviationAlerts";
import { getAlertId } from "../../../helpers/alert";

const Alerts = lazy(() => import("../../alerts/Alerts"));

const Container = styled.div<{ type: HeaderType }>`
  margin-right: 0.5rem;
  white-space: nowrap;
  cursor: pointer;

  ${({ type }) => {
    switch (type) {
      case HeaderType.Danger:
        return css`
          ${outputP3ColorFromRGB([255, 0, 0])}
        `;
      case HeaderType.Warning:
        return css`
          ${outputP3ColorFromRGB([255, 255, 0])}
        `;
    }
  }}
`;

const Sup = styled.sup`
  font-weight: 700;
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3em;
  margin-left: -0.25rem;
`;

const TitleBar = styled.div`
  flex: 1;
  display: flex;

  align-items: center;
`;

const Title = styled.div`
  text-align: left;
  line-height: 1.05;
`;

const Subtext = styled.div`
  opacity: 0.5;
  font-size: 0.7rem;
`;

const Actions = styled.div`
  margin-left: auto;
  margin-right: 0.5rem;

  display: flex;
  align-items: center;

  color: #0080ff;

  font-size: 2.3rem;

  svg {
    cursor: pointer;
  }
`;

interface AlertsProps {
  alerts: Alert[];
  date: string;
}

export default function AlertsIcon({ alerts, date }: AlertsProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("Timezone not found");

  const readAlerts = useAppSelector((state) => state.user.readAlerts);
  const hiddenAlertsForLocation = useAppSelector(
    hiddenAlertsForLocationSelector
  );

  const type = alerts.filter(isAlertDangerous).length
    ? HeaderType.Danger
    : HeaderType.Warning;
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
            <Container type={type}>{icon}</Container>
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
            <Container type={type}>
              {icon}
              <Sup>x{alerts.length}</Sup>
            </Container>
          </Tippy>
        );
    }
  }

  return (
    <BottomSheet
      openButton={renderAlertIcon()}
      title={
        <TitleBar>
          <Title>
            <div>
              {alerts.length} Alert{alerts.length === 1 ? "" : "s"} at{" "}
              {formatInTimeZone(new Date(date), timeZone, "h:mmaaaaa")}
            </div>
            <Subtext>
              {alerts.filter((alert) => !readAlerts[getAlertId(alert)]).length}{" "}
              Unread
              {hiddenAlertsForLocation?.length ? (
                <>, {hiddenAlertsForLocation.length} Additional Hidden</>
              ) : (
                ""
              )}
            </Subtext>
          </Title>
          <Actions>
            <JumpActions />
          </Actions>
        </TitleBar>
      }
    >
      <Suspense fallback={<Loading />}>
        {alerts?.length ? <Alerts alerts={alerts} /> : ""}
      </Suspense>
    </BottomSheet>
  );
}

export function getAlertName(alert: Alert): string | undefined {
  if (isWeatherAlert(alert)) return alert.properties.headline;

  if (isTFRAlert(alert))
    return `TFR ${alert.properties.coreNOTAMData.notam.classification} ${alert.properties.coreNOTAMData.notam.number}`;

  return getAviationAlertName(alert);
}
