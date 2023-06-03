import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { hiddenAlertsSelector } from "../../../alerts/alertsSlice";
import {
  resetHiddenAlerts,
  setAltitude,
  setSwipeInertia,
  setGAirmetRead,
  setHeightUnit,
  setSpeedUnit,
  setTemperatureUnit,
  setDistanceUnit,
  setTimeFormat,
  setAltitudeLevels,
  setLanguage,
  setLapseRate,
} from "../../../user/userSlice";
import {
  AltitudeType,
  OnOff,
  HeightUnit,
  TemperatureUnit,
  DistanceUnit,
  TimeFormat,
  SpeedUnit,
  AltitudeLevels,
} from "./settingEnums";
import { Radio } from "./Radio";
import { Languages } from "../../../../i18n";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_DISTANCE_UNIT,
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_SPEED_UNIT,
  DEFAULT_TEMPERATURE_UNIT,
  DEFAULT_TIME_FORMAT,
} from "../../../../helpers/locale";

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
  const lapseRate = useAppSelector((state) => state.user.lapseRate);
  const hiddenAlerts = useAppSelector(hiddenAlertsSelector);
  const hiddenAlertsNumber = Object.keys(hiddenAlerts).length;
  const { t } = useTranslation();

  return (
    <Container>
      <Radio
        label={t("Altitude format")}
        options={[AltitudeType.AGL, AltitudeType.MSL, AltitudeType.Pressure]}
        value={altitudeType}
        onChange={(value) => dispatch(setAltitude(value))}
      />
      <Radio
        label={t("Altitude levels")}
        tip={t("Altitude levels tip")}
        options={[AltitudeLevels.Default, AltitudeLevels.Normalized]}
        value={altitudeLevels}
        onChange={(value) => dispatch(setAltitudeLevels(value))}
      />
      <Radio
        label={t("Altitude unit")}
        options={sortDefault(
          [HeightUnit.Feet, HeightUnit.Meters],
          DEFAULT_HEIGHT_UNIT
        )}
        value={heightUnit}
        onChange={(value) => dispatch(setHeightUnit(value))}
      />
      <Radio
        label={t("Speed")}
        options={sortDefault(
          [SpeedUnit.MPH, SpeedUnit.KPH, SpeedUnit.Knots, SpeedUnit.mps],
          DEFAULT_SPEED_UNIT
        )}
        value={speedUnit}
        onChange={(value) => dispatch(setSpeedUnit(value))}
      />
      <Radio
        label="Temperature"
        options={sortDefault(
          [TemperatureUnit.Fahrenheit, TemperatureUnit.Celsius],
          DEFAULT_TEMPERATURE_UNIT
        )}
        value={temperatureUnit}
        onChange={(value) => dispatch(setTemperatureUnit(value))}
      />
      <Radio
        label={t("Distance")}
        options={sortDefault(
          [DistanceUnit.Miles, DistanceUnit.Kilometers],
          DEFAULT_DISTANCE_UNIT
        )}
        value={distanceUnit}
        onChange={(value) => dispatch(setDistanceUnit(value))}
      />{" "}
      <Radio
        label={t("Time format")}
        options={sortDefault(
          [TimeFormat.Twelve, TimeFormat.TwentyFour],
          DEFAULT_TIME_FORMAT
        )}
        value={timeFormat}
        onChange={(value) => dispatch(setTimeFormat(value))}
      />
      <Radio
        label={t("Language")}
        options={[
          Languages.EN,
          Languages.Auto,
          Languages.FR,
          Languages.NL,
          Languages.ES,
          Languages.DE,
        ]}
        tip={t("Localization in progress")}
        value={language}
        onChange={(value) => dispatch(setLanguage(value))}
      />
      <Radio
        label={t("Swipe Inertia")}
        options={[OnOff.On, OnOff.Off]}
        value={swipeInertia}
        onChange={(value) => dispatch(setSwipeInertia(value))}
        tip={t("Swipe inertia tip")}
      />
      <Radio
        label={t("Hush G-AIRMETs")}
        options={[OnOff.On, OnOff.Off]}
        value={gAirmetRead}
        onChange={(value) => dispatch(setGAirmetRead(value))}
        tip={t("Hush G-Airmets tip")}
      />{" "}
      <Hr />
      <Radio
        label={`🧪 ${t("Advanced features")}`}
        options={[OnOff.On, OnOff.Off]}
        value={lapseRate}
        onChange={(value) => dispatch(setLapseRate(value))}
        tip={t("Advanced features tip")}
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

function sortDefault<S extends string>(settings: S[], defaultSetting: S): S[] {
  const sortedSettings = [...settings];
  const defaultIndex = sortedSettings.indexOf(defaultSetting);

  if (defaultIndex !== -1) {
    sortedSettings.splice(defaultIndex, 1);
    sortedSettings.unshift(defaultSetting);
  }

  return sortedSettings;
}
