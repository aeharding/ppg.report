import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch, RootState } from "../../store";
import * as storage from "./storage";
import { UserLocation } from "./storage";

export enum AltitudeType {
  AGL = "AGL",
  MSL = "MSL",
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
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
  altitude: storage.getAltitude(),
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
  },
});

export const { updateLocations, updateAltitude } = userReducer.actions;

export const toggleAltitude =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.toggleAltitude());

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitude =
  (altitude: AltitudeType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateAltitude(altitude));

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
