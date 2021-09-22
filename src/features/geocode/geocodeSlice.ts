import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import Geocode from "../../models/Geocode";
import { reverse } from "../../services/geocode";
import { getTrimmedCoordinates } from "../../helpers/coordinates";

type GeocodeResult =
  // component has requested a geocode, to be batched in next bulk request
  | "pending"

  // the book (finished resolving)
  | Geocode

  // Request failed
  | "failed";

interface GeocodeState {
  geocodeByCoordinates: Record<string, GeocodeResult | undefined>;
}

// Define the initial state using that type
const initialState: GeocodeState = {
  geocodeByCoordinates: {},
};

/**
 * The characters rap array gives us raps in the form of
 * urls to resources. So, this reducer fetches and caches the
 * rap resources
 */
export const geocodeReducer = createSlice({
  name: "geocode",
  initialState,
  reducers: {
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    geocodeLoading: (state, action: PayloadAction<string>) => {
      const geocode = state.geocodeByCoordinates[action.payload];
      if (
        !geocode ||
        (geocode !== "failed" &&
          geocode !== "pending" &&
          geocode.isFallbackLabel)
      ) {
        state.geocodeByCoordinates[action.payload] = "pending";
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    geocodeReceived: (state, action: PayloadAction<Geocode>) => {
      const coordinates = getTrimmedCoordinates(
        action.payload.lat,
        action.payload.lon
      );

      if (state.geocodeByCoordinates[coordinates] === "pending") {
        state.geocodeByCoordinates[coordinates] = action.payload;
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    geocodeFailed: (state, action: PayloadAction<string>) => {
      if (state.geocodeByCoordinates[action.payload] === "pending") {
        state.geocodeByCoordinates[action.payload] = "failed";
      }
    },
  },
});

export const { geocodeLoading, geocodeReceived, geocodeFailed } =
  geocodeReducer.actions;

export const getGeocode =
  (lat: number, lon: number) => async (dispatch: AppDispatch) => {
    dispatch(geocodeLoading(getTrimmedCoordinates(lat, lon)));

    try {
      const geocode = await reverse(lat, lon);
      dispatch(geocodeReceived(geocode));
    } catch (e: unknown) {
      dispatch(geocodeFailed(getTrimmedCoordinates(lat, lon)));
      throw e;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const geocodeByCoordinates = (state: RootState) =>
  state.geocode.geocodeByCoordinates;

export default geocodeReducer.reducer;
