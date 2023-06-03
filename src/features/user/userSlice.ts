import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch, RootState } from "../../store";
import { Alert } from "../alerts/alertsSlice";
import * as storage from "./storage";
import { UserLocation } from "./storage";
import { Languages } from "../../i18n";
import { toggleAltitudeType } from "../../helpers/locale";
import {
  AltitudeType,
  OnOff,
  HeightUnit,
  TemperatureUnit,
  DistanceUnit,
  TimeFormat,
  SpeedUnit,
  AltitudeLevels,
} from "../rap/extra/settings/settingEnums";

interface UserState {
  recentLocations: UserLocation[];
  altitude: AltitudeType;
  altitudeLevels: AltitudeLevels;
  heightUnit: HeightUnit;
  speedUnit: SpeedUnit;
  temperatureUnit: TemperatureUnit;
  distanceUnit: DistanceUnit;
  timeFormat: TimeFormat;
  readAlerts: Record<string, string>;
  hiddenAlerts: Record<string, true>;
  swipeInertia: OnOff;
  gAirmetRead: OnOff;
  language: Languages;
  lapseRate: OnOff;
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
  altitude: storage.getAltitude(),
  altitudeLevels: storage.getAltitudeLevels(),
  heightUnit: storage.getHeightUnit(),
  speedUnit: storage.getSpeedUnit(),
  temperatureUnit: storage.getTemperatureUnit(),
  distanceUnit: storage.getDistanceUnit(),
  timeFormat: storage.getTimeFormat(),
  readAlerts: storage.getReadAlerts(),
  hiddenAlerts: storage.getHiddenAlerts(),
  swipeInertia: storage.getSwipeInertia(),
  gAirmetRead: storage.getGAirmetRead(),
  language: storage.getLanguage(),
  lapseRate: storage.getLapseRate(),
};

/**
 * User preferences
 */
export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateLocations(state, action: PayloadAction<UserLocation[]>) {
      state.recentLocations = action.payload;
    },
    toggleAltitude(state) {
      state.altitude = toggleAltitudeType(state.altitude);
    },
    updateAltitude(state, action: PayloadAction<AltitudeType>) {
      state.altitude = action.payload;
    },
    updateAltitudeLevels(state, action: PayloadAction<AltitudeLevels>) {
      state.altitudeLevels = action.payload;
    },
    updateHeightUnit(state, action: PayloadAction<HeightUnit>) {
      state.heightUnit = action.payload;
    },
    updateSpeedUnit(state, action: PayloadAction<SpeedUnit>) {
      state.speedUnit = action.payload;
    },
    updateTemperatureUnit(state, action: PayloadAction<TemperatureUnit>) {
      state.temperatureUnit = action.payload;
    },
    updateDistanceUnit(state, action: PayloadAction<DistanceUnit>) {
      state.distanceUnit = action.payload;
    },
    updateTimeFormat(state, action: PayloadAction<TimeFormat>) {
      state.timeFormat = action.payload;
    },
    readAlert(state, action: PayloadAction<Alert>) {
      state.readAlerts = storage.setReadAlert(action.payload);
    },
    hideAlert(state, action: PayloadAction<Alert>) {
      state.hiddenAlerts = storage.setHiddenAlert(action.payload);
    },
    resetHiddenAlerts(state) {
      storage.resetHiddenAlerts();
      state.hiddenAlerts = {};
    },
    setSwipeInertia(state, action: PayloadAction<OnOff>) {
      state.swipeInertia = storage.setSwipeInertia(action.payload);
    },
    setGAirmetRead(state, action: PayloadAction<OnOff>) {
      state.gAirmetRead = storage.setGAirmetRead(action.payload);
    },
    updateLanguage(state, action: PayloadAction<Languages>) {
      state.language = action.payload;
    },
    updateLapseRate(state, action: PayloadAction<OnOff>) {
      state.lapseRate = action.payload;
    },
  },
});

export const {
  updateLocations,
  readAlert,
  hideAlert,
  resetHiddenAlerts,
  setSwipeInertia,
  setGAirmetRead,
  updateLapseRate,
} = userReducer.actions;

export const toggleAltitude =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.toggleAltitude());

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitude =
  (altitude: AltitudeType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateAltitude(altitude));

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitudeLevels =
  (altitudeLevels: AltitudeLevels) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateAltitudeLevels(altitudeLevels));

    storage.setAltitudeLevels(getState().user.altitudeLevels);
  };

export const setHeightUnit =
  (altitude: HeightUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateHeightUnit(altitude));

    storage.setHeightUnit(getState().user.heightUnit);
  };

export const setSpeedUnit =
  (speedUnit: SpeedUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateSpeedUnit(speedUnit));

    storage.setSpeedUnit(getState().user.speedUnit);
  };

export const setTemperatureUnit =
  (temperatureUnit: TemperatureUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateTemperatureUnit(temperatureUnit));

    storage.setTemperatureUnit(getState().user.temperatureUnit);
  };

export const setDistanceUnit =
  (distanceUnit: DistanceUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateDistanceUnit(distanceUnit));

    storage.setDistanceUnit(getState().user.distanceUnit);
  };

export const setTimeFormat =
  (timeFormat: TimeFormat) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateTimeFormat(timeFormat));

    storage.setTimeFormat(getState().user.timeFormat);
  };

export const visitedLocation =
  (geocode: Geocode) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.visitedLocation({
      ...geocode,
      lastVisited: Date.now(),
    });

    dispatch(updateLocations(updatedLocations));
  };

export const removeLocation =
  (location: UserLocation) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.removeLocation(location);

    dispatch(updateLocations(updatedLocations));
  };

export const setLanguage =
  (language: Languages) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateLanguage(language));

    storage.setLanguage(getState().user.language);
  };

export const setLapseRate =
  (lapseRate: OnOff) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateLapseRate(lapseRate));

    storage.setLapseRate(lapseRate);
  };

export default userReducer.reducer;
