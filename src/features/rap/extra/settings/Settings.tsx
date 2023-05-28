import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { hiddenAlertsSelector } from "../../../alerts/alertsSlice";
import {
  AltitudeType,
  resetHiddenAlerts,
  setAltitude,
  setSwipeInertia,
  OnOff,
  setGAirmetRead,
  SpeedUnit,
  HeightUnit,
  TemperatureUnit,
  setHeightUnit,
  setSpeedUnit,
  setTemperatureUnit,
  DistanceUnit,
  setDistanceUnit,
  TimeFormat,
  setTimeFormat,
  AltitudeLevels,
  setAltitudeLevels,
  setLanguage,
} from "../../../user/userSlice";
import { Radio } from "./Radio";
import { Languages } from "../../../../i18n";

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
  const language = useAppSelector((state) => state.user.language);
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const altitudeLevels = useAppSelector((state) => state.user.altitudeLevels);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const distanceUnit = useAppSelector((state) => state.user.distanceUnit);
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);
  const timeFormat = useAppSelector((state) => state.user.timeFormat);
  const swipeInertia = useAppSelector((state) => state.user.swipeInertia);
  const gAirmetRead = useAppSelector((state) => state.user.gAirmetRead);
  const hiddenAlerts = useAppSelector(hiddenAlertsSelector);
  const hiddenAlertsNumber = Object.keys(hiddenAlerts).length;

  return (
    <Container>
      <Radio
        label="Altitude format"
        options={[AltitudeType.AGL, AltitudeType.MSL]}
        value={altitudeType}
        onChange={(value) => dispatch(setAltitude(value))}
      />
      <Radio
        label="Altitude levels"
        tip="Altitudes are derived from pressure altitude, which varies by hour. Select “normalized” to interpolate data at fixed altitudes."
        options={[AltitudeLevels.Default, AltitudeLevels.Normalized]}
        value={altitudeLevels}
        onChange={(value) => dispatch(setAltitudeLevels(value))}
      />
      <Radio
        label="Altitude unit"
        options={[HeightUnit.Feet, HeightUnit.Meters]}
        value={heightUnit}
        onChange={(value) => dispatch(setHeightUnit(value))}
      />
      <Radio
        label="Speed"
        options={[SpeedUnit.MPH, SpeedUnit.KPH, SpeedUnit.Knots, SpeedUnit.mps]}
        value={speedUnit}
        onChange={(value) => dispatch(setSpeedUnit(value))}
      />
      <Radio
        label="Temperature"
        options={[TemperatureUnit.Fahrenheit, TemperatureUnit.Celsius]}
        value={temperatureUnit}
        onChange={(value) => dispatch(setTemperatureUnit(value))}
      />
      <Radio
        label="Distance"
        options={[DistanceUnit.Miles, DistanceUnit.Kilometers]}
        value={distanceUnit}
        onChange={(value) => dispatch(setDistanceUnit(value))}
      />{" "}
      <Radio
        label="Time format"
        options={[TimeFormat.Twelve, TimeFormat.TwentyFour]}
        value={timeFormat}
        onChange={(value) => dispatch(setTimeFormat(value))}
      />
      <Radio
        label="Language"
        options={[
          Languages.Auto,
          Languages.EN,
          Languages.FR,
          Languages.NL,
          Languages.ES,
          Languages.DE,
        ]}
        tip="Localization is in progress. To help, please email hello@ppg.report"
        value={language}
        onChange={(value) => dispatch(setLanguage(value))}
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
        tip="If turned on, new G-AIRMETs will not trigger the unread alert notifications banner, and they will be pushed to the bottom of the alerts list. This can be useful if you find G-AIRMETs too noisy. [US-only]"
      />{" "}
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
