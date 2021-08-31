import { configureStore } from "@reduxjs/toolkit";
import rapReducer from "./features/rap/rapSlice";
import locationReducer from "./features/location/locationSlice";

export const store = createStore();

export function createStore() {
  return configureStore({
    reducer: {
      rap: rapReducer,
      location: locationReducer,
    },
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
