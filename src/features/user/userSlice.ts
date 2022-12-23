import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch, RootState } from "../../store";
import { Alert } from "../alerts/alertsSlice";
import * as storage from "./storage";
import { UserLocation } from "./storage";

export enum AltitudeType {
  AGL = "AGL",
  MSL = "MSL",
}

// CSS scroll-snap-stop
export enum SwipeInertia {
  On = "On",
  Off = "Off",
}

export function toggle(altitude: AltitudeType): AltitudeType {
  switch (altitude) {
    case AltitudeType.AGL:
      return AltitudeType.MSL;
    case AltitudeType.MSL:
      return AltitudeType.AGL;
  }
}

interface UserState {
  recentLocations: UserLocation[];
  altitude: AltitudeType;
  readAlerts: Record<string, string>;
  hiddenAlerts: Record<string, true>;
  swipeInertia: SwipeInertia;
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
  altitude: storage.getAltitude(),
  readAlerts: storage.getReadAlerts(),
  hiddenAlerts: storage.getHiddenAlerts(),
  swipeInertia: storage.getSwipeInertia(),
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
      state.altitude = toggle(state.altitude);
    },
    updateAltitude(state, action: PayloadAction<AltitudeType>) {
      state.altitude = action.payload;
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
    setSwipeInertia(state, action: PayloadAction<SwipeInertia>) {
      state.swipeInertia = storage.setSwipeInertia(action.payload);
    },
  },
});

export const {
  updateLocations,
  readAlert,
  hideAlert,
  resetHiddenAlerts,
  setSwipeInertia,
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

export default userReducer.reducer;
