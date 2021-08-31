import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import { getPosition } from "../../services/position";

type LocationResult =
  // component has requested a location, to be batched in next bulk request
  | "pending"

  // the book (finished resolving)
  | GeolocationPosition

  // Request failed
  | "failed";

interface LocationState {
  location: LocationResult;
}

// Define the initial state using that type
const initialState: LocationState = {
  location: "pending",
};

/**
 * The characters rap array gives us raps in the form of
 * urls to resources. So, this reducer fetches and caches the
 * rap resources
 */
export const locationReducer = createSlice({
  name: "location",
  initialState,
  reducers: {
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    locationLoading: (state) => {
      state.location = "pending";
    },

    /**
     * @param action Action containing payload as the Rap
     */
    locationReceived: (state, action: PayloadAction<GeolocationPosition>) => {
      if (state.location === "pending") {
        state.location = action.payload;
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    locationFailed: (state, action: PayloadAction<unknown>) => {
      if (state.location === "pending") {
        state.location = "failed";
      }
    },
  },
});

export const { locationLoading, locationReceived, locationFailed } =
  locationReducer.actions;

export const getLocation = () => async (dispatch: AppDispatch) => {
  dispatch(locationLoading());

  try {
    const position = await getPosition();
    dispatch(locationReceived(position));
  } catch (e: unknown) {
    dispatch(locationFailed(e));
    throw e;
  }
};

// Other code such as selectors can use the imported `RootState` type
export const location = (state: RootState) => state.location.location;

export default locationReducer.reducer;
