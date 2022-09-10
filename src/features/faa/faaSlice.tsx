import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { differenceInMinutes } from "date-fns";
import { TFRFeature } from "../../services/faa";
import { AppDispatch, RootState } from "../../store";
import * as faa from "../../services/faa";

interface FaaState {
  tfrs?: TFRResult;
  tfrsLastUpdated?: string;
}

export type TFRResult =
  // component has requested a tfr, to be batched in next bulk request
  | "pending"

  // the TFR data (finished resolving)
  | TFRFeature[]

  // Request failed
  | "failed";

// Define the initial state using that type
const initialState: FaaState = {
  tfrs: undefined,
  tfrsLastUpdated: undefined,
};

/**
 * User preferences
 */
export const faaReducer = createSlice({
  name: "faa",
  initialState,
  reducers: {
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    tfrsLoading: (state) => {
      switch (state.tfrs) {
        case undefined:
          state.tfrs = "pending";
          return;
        case "pending":
          return;
        case "failed":
        default: {
          if (
            !state.tfrsLastUpdated ||
            Math.abs(
              differenceInMinutes(new Date(state.tfrsLastUpdated), new Date())
            ) > 30
          ) {
            state.tfrs = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    tfrsReceived: (state, action: PayloadAction<TFRFeature[]>) => {
      if (state.tfrs === "pending") {
        state.tfrs = action.payload;
        state.tfrsLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    tfrsFailed: (state) => {
      if (state.tfrs === "pending") {
        state.tfrs = "failed";
        state.tfrsLastUpdated = new Date().toISOString();
      }
    },

    clear: () => initialState,
  },
});

export const { tfrsLoading, tfrsReceived, tfrsFailed, clear } =
  faaReducer.actions;

export default faaReducer.reducer;

export const getTFRs =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    loadAlerts();

    async function loadAlerts() {
      if (getState().faa.tfrs === "pending") return;
      dispatch(tfrsLoading());
      if (getState().faa.tfrs !== "pending") return;

      try {
        const alerts = await faa.getTFRs({ lat, lon });
        dispatch(tfrsReceived(alerts));
      } catch (e: unknown) {
        dispatch(tfrsFailed());
        throw e;
      }
    }
  };
