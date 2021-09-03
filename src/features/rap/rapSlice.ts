import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as rapidRefresh from "../../services/rapidRefresh";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { Rap } from "gsl-parser";

export type RapResult =
  // component has requested a book, to be batched in next bulk request
  | "pending"

  // the Rap by hour (finished resolving)
  | RapPayload

  // API request failed
  | "failed";

export interface RapPayload {
  updated: string;
  data: Rap[];
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
    rapReceived: (state, action: PayloadAction<{ id: string; rap: Rap[] }>) => {
      if (state.rapByLocation[action.payload.id] === "pending") {
        state.rapByLocation[action.payload.id] = {
          updated: new Date().toISOString(),
          data: action.payload.rap,
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
  },
});

export const { rapLoading, rapReceived, rapFailed } = rapReducer.actions;

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

      dispatch(rapReceived({ id: getTrimmedCoordinates(lat, lon), rap }));
    } catch (e) {
      dispatch(rapFailed(getTrimmedCoordinates(lat, lon)));
      throw e;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const rapByLocation = (state: RootState) => state.rap.rapByLocation;

export default rapReducer.reducer;
