import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as weather from "../../services/weather";
import { differenceInMinutes } from "date-fns";
import axios from "axios";
import * as timezoneService from "../../services/timezone";
import * as aviationWeatherService from "../../services/aviationWeather";
import { ParseError, parseTAFAsForecast } from "metar-taf-parser";

interface Coordinates {
  lat: number;
  lon: number;
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
    windSpeed: Property;
    windGust: Property;
  };
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
    | "rain_showers"
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

export interface Alerts {
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
  | aviationWeatherService.TAFReport

  // Request failed
  | "failed"

  // Nothing found for the coordinates
  | "not-available";

interface WeatherState {
  weather: WeatherResult | undefined;
  weatherLastUpdated?: string;
  aviationWeather: AviationWeatherResult | undefined;
  aviationWeatherLastUpdated?: string;
  alerts: AlertsResult | undefined;
  alertsLastUpdated?: string;
  timeZone: string | undefined;
  timeZoneLoading: boolean;
}

// Define the initial state using that type
const initialState: WeatherState = {
  weather: undefined,
  weatherLastUpdated: undefined,
  aviationWeather: undefined,
  aviationWeatherLastUpdated: undefined,
  alerts: undefined,
  alertsLastUpdated: undefined,
  timeZone: undefined,
  timeZoneLoading: true,
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
    weatherLoading: (state) => {
      switch (state.weather) {
        case undefined:
          state.weather = "pending";
          return;
        case "pending":
          return;
        case "failed":
        default: {
          if (
            !state.weatherLastUpdated ||
            Math.abs(
              differenceInMinutes(
                new Date(state.weatherLastUpdated),
                new Date()
              )
            ) > 30
          ) {
            state.weather = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    weatherReceived: (state, action: PayloadAction<Weather>) => {
      if (state.weather === "pending") {
        state.weather = action.payload;
        state.weatherLastUpdated = new Date().toISOString();
      }
    },

    timeZoneReceived: (state, action: PayloadAction<string>) => {
      state.timeZone = action.payload;
      state.timeZoneLoading = false;
    },

    timeZoneFailed: (state) => {
      state.timeZoneLoading = false;
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    weatherFailed: (state) => {
      if (state.weather === "pending") {
        state.weather = "failed";
        state.weatherLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    alertsLoading: (state) => {
      switch (state.alerts) {
        case undefined:
          state.alerts = "pending";
          return;
        case "pending":
          return;
        case "failed":
        default: {
          if (
            !state.alertsLastUpdated ||
            Math.abs(
              differenceInMinutes(new Date(state.alertsLastUpdated), new Date())
            ) > 30
          ) {
            state.alerts = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    alertsReceived: (state, action: PayloadAction<Alerts>) => {
      if (state.alerts === "pending") {
        state.alerts = action.payload;
        state.alertsLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    alertsFailed: (state) => {
      if (state.alerts === "pending") {
        state.alerts = "failed";
        state.alertsLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    aviationWeatherLoading: (state) => {
      switch (state.aviationWeather) {
        case undefined:
          state.aviationWeather = "pending";
          return;
        case "pending":
        case "not-available":
          return;
        case "failed":
        default: {
          if (
            !state.aviationWeatherLastUpdated ||
            Math.abs(
              differenceInMinutes(
                new Date(state.aviationWeatherLastUpdated),
                new Date()
              )
            ) > 30
          ) {
            state.aviationWeather = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    aviationWeatherReceived: (
      state,
      action: PayloadAction<aviationWeatherService.TAFReport>
    ) => {
      if (state.aviationWeather === "pending") {
        state.aviationWeather = action.payload;
        state.aviationWeatherLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    aviationWeatherFailed: (state) => {
      if (state.aviationWeather === "pending") {
        state.aviationWeather = "failed";
        state.aviationWeatherLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    aviationWeatherNotAvailable: (state) => {
      if (state.aviationWeather === "pending") {
        state.aviationWeather = "not-available";
        state.aviationWeatherLastUpdated = new Date().toISOString();
      }
    },

    clear: () => initialState,
  },
});

export const {
  weatherLoading,
  weatherReceived,
  timeZoneReceived,
  timeZoneFailed,
  weatherFailed,
  alertsLoading,
  alertsReceived,
  alertsFailed,
  aviationWeatherLoading,
  aviationWeatherReceived,
  aviationWeatherFailed,
  aviationWeatherNotAvailable,
  clear,
} = weatherReducer.actions;

export const getWeather =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    loadPointData();
    loadAlerts();
    loadAviationWeather();

    async function loadPointData() {
      if (getState().weather.weather === "pending") return;
      dispatch(weatherLoading());
      if (getState().weather.weather !== "pending") return;

      try {
        let forecastGridDataUrl;
        try {
          const data = await weather.getPointResources({ lat, lon });

          forecastGridDataUrl = data.forecastGridDataUrl;

          dispatch(timeZoneReceived(data.timeZone));
        } catch (e) {
          if (getState().weather.timeZone) throw e;

          // Likely Mexico or Canada
          // We still need the timezone, so try to fall back anyways
          try {
            let timeZone = await timezoneService.get({ lat, lon });
            dispatch(timeZoneReceived(timeZone));
          } catch (e) {
            if (!axios.isAxiosError(e)) throw e;

            dispatch(timeZoneFailed());

            throw e;
          }

          throw e;
        }

        if (forecastGridDataUrl) {
          const data = await weather.getGridData(forecastGridDataUrl);

          dispatch(weatherReceived(data));
        }
      } catch (e) {
        dispatch(weatherFailed());
        throw e;
      }
    }

    async function loadAlerts() {
      if (getState().weather.alerts === "pending") return;
      dispatch(alertsLoading());
      if (getState().weather.alerts !== "pending") return;

      try {
        const alerts = await weather.getAlerts({ lat, lon });
        dispatch(alertsReceived(alerts));
      } catch (e: unknown) {
        dispatch(alertsFailed());
        throw e;
      }
    }

    async function loadAviationWeather() {
      if (getState().weather.aviationWeather === "pending") return;
      dispatch(aviationWeatherLoading());
      if (getState().weather.aviationWeather !== "pending") return;

      try {
        const rawTAF = await aviationWeatherService.getTAF({ lat, lon });
        if (!rawTAF) {
          dispatch(aviationWeatherNotAvailable());
        } else {
          dispatch(aviationWeatherReceived(rawTAF));
        }
      } catch (e: unknown) {
        dispatch(aviationWeatherFailed());
        throw e;
      }
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const currentWeather = (state: RootState) => state.weather.weather;

export const timeZoneSelector = (state: RootState) => {
  return state.weather.timeZone;
};

const tafReportSelector = (state: RootState) => state.weather.aviationWeather;

export const tafReport = createSelector(
  [tafReportSelector],
  (aviationWeather) => {
    if (
      !aviationWeather ||
      aviationWeather === "pending" ||
      aviationWeather === "failed" ||
      aviationWeather === "not-available"
    )
      return;

    try {
      return parseTAFAsForecast(aviationWeather.raw, {
        date: new Date(aviationWeather.date),
      });
    } catch (e) {
      if (e instanceof ParseError) {
        console.error(e);
        return;
      }
      throw e;
    }
  }
);

export default weatherReducer.reducer;
