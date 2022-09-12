import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as rapidRefresh from "../../services/rapidRefresh";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { CoordinatesGslError, GslError, Rap } from "gsl-parser";

export type RapResult =
  // component has requested a book, to be batched in next bulk request
  | "pending"

  // the Rap by hour (finished resolving)
  | Rap[]

  // API request failed
  | "failed"

  // Unsupported coordinates provided
  | "coordinates-error";
interface RapState {
  rap: RapResult | undefined;
  rapUpdated: string | undefined;
}

// Define the initial state using that type
const initialState: RapState = {
  rap: undefined,
  rapUpdated: undefined,
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
    rapLoading: (state) => {
      switch (state.rap) {
        case "failed":
        case "coordinates-error":
        case undefined:
          state.rap = "pending";
          return;
        case "pending":
          return;
        default: {
          if (
            !state.rapUpdated ||
            Math.abs(
              differenceInMinutes(new Date(state.rapUpdated), new Date())
            ) > 30
          ) {
            state.rap = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    rapReceived: (state, action: PayloadAction<Rap[]>) => {
      if (state.rap === "pending") {
        state.rap = action.payload;
        state.rapUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    rapFailed: (state) => {
      if (state.rap === "pending") {
        state.rap = "failed";
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    rapBadCoordinates: (state) => {
      if (state.rap === "pending") {
        state.rap = "coordinates-error";
      }
    },

    clear: () => initialState,
  },
});

export const { rapLoading, rapReceived, rapFailed, rapBadCoordinates, clear } =
  rapReducer.actions;

export const getRap =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(rapLoading());

    const isPending = getState().rap.rap === "pending";

    if (!isPending) return;

    try {
      const rap = await rapidRefresh.getRap(lat, lon);

      dispatch(rapReceived(rap));
    } catch (error) {
      if (!(error instanceof GslError)) {
        dispatch(rapFailed());

        throw error;
      }

      if (error instanceof CoordinatesGslError) {
        dispatch(rapBadCoordinates());

        throw error;
      }

      dispatch(rapFailed());

      throw error;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const rap = (state: RootState) => state.rap.rap;

export default rapReducer.reducer;
