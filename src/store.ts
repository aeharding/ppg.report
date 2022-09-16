import { configureStore } from "@reduxjs/toolkit";
import rapReducer from "./features/rap/rapSlice";
import geocodeReducer from "./features/geocode/geocodeSlice";
import userReducer from "./features/user/userSlice";
import weatherReducer from "./features/weather/weatherSlice";
import installReducer from "./features/install/installSlice";
import faaReducer from "./features/faa/faaSlice";

export const store = createStore();

export function createStore() {
  return configureStore({
    reducer: {
      rap: rapReducer,
      geocode: geocodeReducer,
      user: userReducer,
      weather: weatherReducer,
      install: installReducer,
      faa: faaReducer,
    },
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
