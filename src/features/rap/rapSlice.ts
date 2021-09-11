import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as rapidRefresh from "../../services/rapidRefresh";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { CoordinatesGslError, GslError, Rap } from "gsl-parser";

export type RapResult =
  // component has requested a book, to be batched in next bulk request
  | "pending"

  // the Rap by hour (finished resolving)
  | RapPayload

  // API request failed
  | "failed"

  // Unsupported coordinates provided
  | "coordinates-error";

export interface RapPayload {
  updated: string;
  data: Rap[];
  lat: number;
  lon: number;
}

interface RapState {
  rapByLocation: Record<string, RapResult>;
}

// Define the initial state using that type
const initialState: RapState = {
  rapByLocation: {},
};

/**
 * The characters rap array gives us raps in the form of
 * urls to resources. So, this reducer fetches and caches the
 * rap resources
 */
export const rapReducer = createSlice({
  name: "rap",
  initialState,
  reducers: {
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    rapLoading: (state, action: PayloadAction<string>) => {
      const payload = state.rapByLocation[action.payload];

      switch (payload) {
        case "failed":
        case "coordinates-error":
        case undefined:
          state.rapByLocation[action.payload] = "pending";
          return;
        case "pending":
          return;
        default: {
          if (
            Math.abs(
              differenceInMinutes(new Date(payload.updated), new Date())
            ) > 30
          ) {
            state.rapByLocation[action.payload] = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    rapReceived: (
      state,
      action: PayloadAction<{
        rap: Rap[];
        lat: number;
        lon: number;
      }>
    ) => {
      const id = getTrimmedCoordinates(action.payload.lat, action.payload.lon);

      if (state.rapByLocation[id] === "pending") {
        state.rapByLocation[id] = {
          updated: new Date().toISOString(),
          data: action.payload.rap,
          lat: action.payload.lat,
          lon: action.payload.lon,
        };
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    rapFailed: (state, action: PayloadAction<string>) => {
      if (state.rapByLocation[action.payload] === "pending") {
        state.rapByLocation[action.payload] = "failed";
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    rapBadCoordinates: (state, action: PayloadAction<string>) => {
      if (state.rapByLocation[action.payload] === "pending") {
        state.rapByLocation[action.payload] = "coordinates-error";
      }
    },
  },
});

export const { rapLoading, rapReceived, rapFailed, rapBadCoordinates } =
  rapReducer.actions;

export const getRap =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(rapLoading(getTrimmedCoordinates(lat, lon)));

    const isPending =
      getState().rap.rapByLocation[getTrimmedCoordinates(lat, lon)] ===
      "pending";

    if (!isPending) return;

    try {
      const rap = await rapidRefresh.getRap(lat, lon);

      dispatch(rapReceived({ rap, lat, lon }));
    } catch (error) {
      dispatch(
        error instanceof CoordinatesGslError
          ? rapBadCoordinates(getTrimmedCoordinates(lat, lon))
          : rapFailed(getTrimmedCoordinates(lat, lon))
      );

      if (!(error instanceof GslError)) throw error;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const rapByLocation = (state: RootState) => state.rap.rapByLocation;

export default rapReducer.reducer;
