import styled from "@emotion/styled/macro";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { hiddenAlertsSelector } from "../../../alerts/alertsSlice";
import {
  AltitudeType,
  resetHiddenAlerts,
  setAltitude,
  setSwipeInertia,
  OnOff,
  setGAirmetRead,
} from "../../../user/userSlice";
import { Radio } from "./Radio";

const Container = styled.div`
  padding: 0.5rem 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Hr = styled.hr`
  width: 100%;
  opacity: 0.2;
`;

export default function Settings() {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const swipeInertia = useAppSelector((state) => state.user.swipeInertia);
  const gAirmetRead = useAppSelector((state) => state.user.gAirmetRead);
  const hiddenAlerts = useAppSelector(hiddenAlertsSelector);
  const hiddenAlertsNumber = Object.keys(hiddenAlerts).length;

  return (
    <Container>
      <Radio
        label="Altitude"
        options={[AltitudeType.AGL, AltitudeType.MSL]}
        value={altitudeType}
        onChange={(value) => dispatch(setAltitude(value))}
      />
      <Radio
        label="Swipe Inertia"
        options={[OnOff.On, OnOff.Off]}
        value={swipeInertia}
        onChange={(value) => dispatch(setSwipeInertia(value))}
        tip="If turned off, swiping quickly will not skip hours. Useful especially on Android devices."
      />
      <Radio
        label="Hush G-AIRMETs"
        options={[OnOff.On, OnOff.Off]}
        value={gAirmetRead}
        onChange={(value) => dispatch(setGAirmetRead(value))}
        tip="If turned on, new G-AIRMETs will not trigger the unread alert notifications banner, and they will be pushed to the bottom of the alerts list. This can be useful if you find G-AIRMETs too noisy."
      />

      <Hr />

      <div onClick={() => dispatch(resetHiddenAlerts())}>
        {hiddenAlertsNumber > 0 ? (
          <>
            You have <strong>{hiddenAlertsNumber}</strong> hidden permanent TFR
            {hiddenAlertsNumber === 1 ? "" : "s"}. Tap here to reset all.
          </>
        ) : (
          <>
            You have no hidden TFRs. Permanent TFRs can be hidden by tapping{" "}
            <i>Hide</i> in the alert details.
          </>
        )}
      </div>

      {/* <Radio label="Wind Speed" options={["mph", "km/h", "kts", "m/s"]} />
      <Radio label="Temperature" options={["°F", "°C"]} />
      <Radio label="Elevation" options={["ft", "m"]} /> */}
    </Container>
  );
}
