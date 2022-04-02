import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as weather from "../../services/weather";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { differenceInMinutes } from "date-fns";

interface Coordinates {
  lat: number;
  lon: number;
  updated: string;
}

export type WeatherResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | Weather

  // Request failed
  | "failed";

export interface Weather extends Coordinates {
  properties: {
    probabilityOfPrecipitation: Property;
    skyCover: Property;
    weather: Property<WeatherObservation[]>;
  };
  timeZone: string;
}

export interface WeatherObservation {
  coverage?:
    | "areas"
    | "brief"
    | "chance"
    | "definite"
    | "few"
    | "frequent"
    | "intermittent"
    | "isolated"
    | "likely"
    | "numerous"
    | "occasional"
    | "patchy"
    | "periods"
    | "scattered"
    | "slight_chance"
    | "widespread";
  weather?:
    | "fog_mist"
    | "dust_storm"
    | "dust"
    | "drizzle"
    | "funnel_cloud"
    | "fog"
    | "smoke"
    | "hail"
    | "snow_pellets"
    | "haze"
    | "ice_crystals"
    | "ice_pellets"
    | "dust_whirls"
    | "spray"
    | "rain"
    | "sand"
    | "snow_grains"
    | "snow"
    | "squalls"
    | "sand_storm"
    | "thunderstorms"
    | "unknown"
    | "volcanic_ash";
  intensity?: "light" | "very_light" | "moderate" | "heavy";
  attributes: (
    | "damaging_wind"
    | "dry_thunderstorms"
    | "flooding"
    | "gusty_wind"
    | "heavy_rain"
    | "large_hail"
    | "small_hail"
    | "tornadoes"
  )[];
}

export interface Property<T = number> {
  uom: string;
  values: Value<T>[];
}

export interface Value<T = unknown> {
  validTime: string;
  value: T;
}

export type AlertsResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | Alerts

  // Request failed
  | "failed";

export interface Alerts extends Coordinates {
  features: Feature[];
}

export interface Feature {
  properties: {
    sent: string;
    effective: string;
    onset: string;
    expires: string;
    ends: string;
    category:
      | "Met"
      | "Geo"
      | "Safety"
      | "Security"
      | "Rescue"
      | "Fire"
      | "Health"
      | "Env"
      | "Transport"
      | "Infra"
      | "CBRNE"
      | "Other";
    severity: "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
    certainty: "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";
    urgency: "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
    event: string;
    headline?: string;
    description: string;
    instruction?: string;
    parameters: {
      AWIPSidentifier: string[];
      WMOidentifier: string[];
      NWSheadline: string[];
      eventMotionDescription: string[];
      BLOCKCHANNEL: string[];
      "EAS-ORG": string[];
    };
  };
}

type AviationWeatherResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | AviationWeather

  // Request failed
  | "failed";

export interface AviationWeather extends Coordinates {}

interface WeatherState {
  weatherByCoordinates: Record<string, WeatherResult | undefined>;
  aviationWeatherByCoordinates: Record<
    string,
    AviationWeatherResult | undefined
  >;
  alertsByCoordinates: Record<string, AlertsResult | undefined>;
}

// Define the initial state using that type
const initialState: WeatherState = {
  weatherByCoordinates: {},
  aviationWeatherByCoordinates: {},
  alertsByCoordinates: {},
};

/**
 * The characters rap array gives us raps in the form of
 * urls to resources. So, this reducer fetches and caches the
 * rap resources
 */
export const weatherReducer = createSlice({
  name: "weather",
  initialState,
  reducers: {
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    weatherLoading: (state, action: PayloadAction<string>) => {
      const payload = state.weatherByCoordinates[action.payload];

      switch (payload) {
        case undefined:
          state.weatherByCoordinates[action.payload] = "pending";
          return;
        case "failed": // TODO on failure stop polling
        case "pending":
          return;
        default: {
          if (
            Math.abs(
              differenceInMinutes(new Date(payload.updated), new Date())
            ) > 30
          ) {
            state.weatherByCoordinates[action.payload] = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    weatherReceived: (
      state,
      action: PayloadAction<{ weather: Weather; lat: number; lon: number }>
    ) => {
      const coordinates = getTrimmedCoordinates(
        action.payload.lat,
        action.payload.lon
      );

      if (state.weatherByCoordinates[coordinates] === "pending") {
        state.weatherByCoordinates[coordinates] = {
          ...action.payload.weather,
          lat: action.payload.lat,
          lon: action.payload.lon,
          updated: new Date().toISOString(),
        };
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    weatherFailed: (state, action: PayloadAction<string>) => {
      if (state.weatherByCoordinates[action.payload] === "pending") {
        state.weatherByCoordinates[action.payload] = "failed";
      }
    },
    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    alertsLoading: (state, action: PayloadAction<string>) => {
      const payload = state.alertsByCoordinates[action.payload];

      switch (payload) {
        case undefined:
          state.alertsByCoordinates[action.payload] = "pending";
          return;
        case "failed": // TODO on failure stop polling
        case "pending":
          return;
        default: {
          if (
            Math.abs(
              differenceInMinutes(new Date(payload.updated), new Date())
            ) > 30
          ) {
            state.alertsByCoordinates[action.payload] = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    alertsReceived: (
      state,
      action: PayloadAction<{ alerts: Alerts; lat: number; lon: number }>
    ) => {
      const coordinates = getTrimmedCoordinates(
        action.payload.lat,
        action.payload.lon
      );

      if (state.alertsByCoordinates[coordinates] === "pending") {
        state.alertsByCoordinates[coordinates] = {
          ...action.payload.alerts,
          lat: action.payload.lat,
          lon: action.payload.lon,
          updated: new Date().toISOString(),
        };
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    alertsFailed: (state, action: PayloadAction<string>) => {
      if (state.alertsByCoordinates[action.payload] === "pending") {
        state.alertsByCoordinates[action.payload] = "failed";
      }
    },
  },
});

export const {
  weatherLoading,
  weatherReceived,
  weatherFailed,
  alertsLoading,
  alertsReceived,
  alertsFailed,
} = weatherReducer.actions;

export const getWeather =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    loadPointData();
    loadAlerts();

    async function loadPointData() {
      if (
        getState().weather.weatherByCoordinates[
          getTrimmedCoordinates(lat, lon)
        ] === "pending"
      )
        return;

      dispatch(weatherLoading(getTrimmedCoordinates(lat, lon)));

      const isPending =
        getState().weather.weatherByCoordinates[
          getTrimmedCoordinates(lat, lon)
        ] === "pending";

      if (!isPending) return;

      try {
        const result = await weather.get({ lat, lon });
        dispatch(weatherReceived({ weather: result, lat, lon }));
      } catch (e: unknown) {
        dispatch(weatherFailed(getTrimmedCoordinates(lat, lon)));
        throw e;
      }
    }

    async function loadAlerts() {
      if (
        getState().weather.alertsByCoordinates[
          getTrimmedCoordinates(lat, lon)
        ] === "pending"
      )
        return;

      dispatch(alertsLoading(getTrimmedCoordinates(lat, lon)));

      const isPending =
        getState().weather.alertsByCoordinates[
          getTrimmedCoordinates(lat, lon)
        ] === "pending";

      if (!isPending) return;

      try {
        const alerts = await weather.getAlerts({ lat, lon });
        dispatch(alertsReceived({ alerts, lat, lon }));
      } catch (e: unknown) {
        dispatch(alertsFailed(getTrimmedCoordinates(lat, lon)));
        throw e;
      }
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const weatherByCoordinates = (state: RootState) =>
  state.weather.weatherByCoordinates;

export default weatherReducer.reducer;
