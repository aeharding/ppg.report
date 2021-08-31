import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import Rap from "../../models/Rap";
import * as rapidRefresh from "../../services/rapidRefresh";

type RapResult =
  // component has requested a book, to be batched in next bulk request
  | "pending"

  // the book (finished resolving)
  | Rap

  // API request failed
  | "failed";

interface RapState {
  rapByLocation: Record<string, RapResult>;
}

// Define the initial state using that type
const initialState: RapState = {
  rapByLocation: {},
};

const latLonToId = (lat: number, lon: number) => `${lat},${lon}`;

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
      if (state.rapByLocation[action.payload] === undefined) {
        state.rapByLocation[action.payload] = "pending";
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    rapReceived: (state, action: PayloadAction<{ id: string; rap: Rap }>) => {
      if (state.rapByLocation[action.payload.id] === "pending") {
        state.rapByLocation[action.payload.id] = action.payload.rap;
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
  (lat: number, lon: number) => async (dispatch: AppDispatch) => {
    dispatch(rapLoading(latLonToId(lat, lon)));

    try {
      const rap = await rapidRefresh.getRap(lat, lon);
      console.log("rap", rap);
      dispatch(rapReceived({ id: latLonToId(lat, lon), rap }));
    } catch (e) {
      dispatch(rapFailed(latLonToId(lat, lon)));
      throw e;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const rapByLocation = (state: RootState) => state.rap.rapByLocation;

export default rapReducer.reducer;
