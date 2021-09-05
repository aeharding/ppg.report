import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch } from "../../store";
import * as storage from "./storage";
import { UserLocation } from "./storage";

interface UserState {
  recentLocations: UserLocation[];
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
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
  },
});

export const { updateLocations } = userReducer.actions;

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
