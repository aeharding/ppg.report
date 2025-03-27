import styled from "@emotion/styled";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeZoneSelector } from "../weatherSlice";
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
import { css } from "@emotion/react";
import { useAppSelector } from "../../../hooks";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import JumpActions from "../../alerts/JumpActions";
import { getAviationAlertName } from "../../../helpers/aviationAlerts";
import { isAlertRead } from "../../../helpers/alert";
import { getTimeFormatString } from "../aviation/Forecast";
import { OnOff } from "../../rap/extra/settings/settingEnums";
import Tooltip from "../../../shared/Tooltip";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

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

  const timeFormat = useAppSelector((state) => state.user.timeFormat);
  const userState = useAppSelector((state) => state.user);
  const hiddenAlertsForLocation = useAppSelector(
    hiddenAlertsForLocationSelector,
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
          <Tooltip mouseOnly contents={() => getAlertName(alerts[0])}>
            <Container type={type}>{icon}</Container>
          </Tooltip>
        );
      default:
        return (
          <Tooltip
            mouseOnly
            contents={() => (
              <ol>
                {alerts.map((alert, index) => (
                  <li key={index}>{getAlertName(alert)}</li>
                ))}
              </ol>
            )}
          >
            <Container type={type}>
              {icon}
              <Sup>x{alerts.length}</Sup>
            </Container>
          </Tooltip>
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
              {format(
                new TZDate(date, timeZone),
                getTimeFormatString(timeFormat, true),
              )}
            </div>
            <Subtext>
              {
                alerts.filter(
                  (alert) =>
                    // Force gAirmetRead to false to show the actual read/unread regardless of setting
                    !isAlertRead(alert, {
                      ...userState,
                      gAirmetRead: OnOff.Off,
                    }),
                ).length
              }{" "}
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
