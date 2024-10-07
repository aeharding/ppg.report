import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { AppDispatch } from "../../store";
import * as nwsWeather from "../../services/nwsWeather";
import { differenceInMinutes, isPast } from "date-fns";
import * as timezoneService from "../../services/timezone";
import * as aviationWeatherService from "../../services/aviationWeather";
import * as elevationService from "../../services/elevation";
import * as storage from "../user/storage";
import { WindsAloftReport } from "../../models/WindsAloft";
import * as rapidRefresh from "../../services/rapidRefresh";
import * as openMeteo from "../../services/openMeteo";
import {
  isPossiblyWithinUSA,
  isWithinNWSRAPModelBoundary,
} from "../../helpers/geo";
import { AxiosError } from "axios";

const UPDATE_INTERVAL_MINUTES = 30;

export type Weather = nwsWeather.NWSWeather | openMeteo.OpenMeteoWeather;

export type WeatherResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | Weather

  // Request failed
  | "failed";

export type AlertsResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // Outside USA
  | "not-available"

  // the weather data (finished resolving)
  | nwsWeather.Alerts

  // Request failed
  | "failed";

type AviationWeatherResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | aviationWeatherService.TAFReport

  // Request failed
  | "failed"

  // Nothing found for the coordinates
  | "not-available";

type AviationAlertsResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | aviationWeatherService.AviationAlertFeature[]

  // Request failed
  | "failed"

  // Nothing found for the coordinates
  | "not-available";

type DiscussionResult =
  // component has requested a weather, to be batched in next bulk request
  | "pending"

  // the weather data (finished resolving)
  | Discussion

  // Request failed
  | "failed"

  // Nothing found for the coordinates
  | "not-available";

export type WindsAloftResult =
  // component has requested a book, to be batched in next bulk request
  | "pending"

  // the winds aloft by hour (finished resolving)
  | WindsAloftReport

  // API request failed
  | "failed";

export interface Discussion {
  id: string;
  wmoCollectiveId: string;
  issuingOffice: string;
  issuanceTime: string;
  productCode: string;
  productName: string;
  productText: string;
}

interface WeatherState {
  weather: WeatherResult | undefined;
  weatherLastUpdated?: string;
  aviationWeather: AviationWeatherResult | undefined;
  aviationWeatherLastUpdated?: string;
  alerts: AlertsResult | undefined;
  alertsLastUpdated?: string;
  aviationAlerts: AviationAlertsResult | undefined;
  aviationAlertsLastUpdated?: string;
  timeZone: string | undefined;
  timeZoneLoading: boolean;
  usingLocalTime: boolean;
  elevation: number | undefined;
  elevationLoading: boolean;
  discussion: DiscussionResult | undefined;
  discussionLastUpdated?: string;
  discussionLastViewed: string | undefined;

  windsAloft: WindsAloftResult | undefined;
  windsAloftUpdated: string | undefined;

  coordinates?: { lat: number; lon: number };
}

// Define the initial state using that type
const initialState: WeatherState = {
  weather: undefined,
  weatherLastUpdated: undefined,
  aviationWeather: undefined,
  aviationWeatherLastUpdated: undefined,
  alerts: undefined,
  alertsLastUpdated: undefined,
  aviationAlerts: undefined,
  aviationAlertsLastUpdated: undefined,
  timeZone: undefined,
  timeZoneLoading: true,
  usingLocalTime: true,
  elevation: undefined,
  elevationLoading: false,
  discussion: undefined,
  discussionLastViewed: undefined,

  windsAloft: undefined,
  windsAloftUpdated: undefined,

  coordinates: undefined,
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
    weatherResetLoading: (state) => {
      state.weather = "pending";
    },

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
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
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
      state.usingLocalTime = false;
    },

    timeZoneFailed: (state) => {
      state.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      state.timeZoneLoading = false;
      state.usingLocalTime = true;
    },

    elevationLoading: (state) => {
      if (state.elevation != null) return;

      state.elevationLoading = true;
    },

    elevationReceived: (state, action: PayloadAction<number>) => {
      state.elevation = action.payload;
      state.elevationLoading = false;
    },

    elevationFailed: (state) => {
      state.elevationLoading = false;
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
              differenceInMinutes(
                new Date(state.alertsLastUpdated),
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
          ) {
            state.alerts = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    alertsReceived: (state, action: PayloadAction<nwsWeather.Alerts>) => {
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
    alertsNotAvailable: (state) => {
      state.alerts = "not-available";
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
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
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
      action: PayloadAction<aviationWeatherService.TAFReport>,
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

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    aviationAlertsLoading: (state) => {
      switch (state.aviationAlerts) {
        case undefined:
          state.aviationAlerts = "pending";
          return;
        case "pending":
          return;
        case "failed":
        default: {
          if (
            !state.aviationAlertsLastUpdated ||
            Math.abs(
              differenceInMinutes(
                new Date(state.aviationAlertsLastUpdated),
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
          ) {
            state.aviationAlerts = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    aviationAlertsReceived: (
      state,
      action: PayloadAction<aviationWeatherService.AviationAlertFeature[]>,
    ) => {
      if (state.aviationAlerts === "pending") {
        state.aviationAlerts = action.payload;
        state.aviationAlertsLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    aviationAlertsFailed: (state) => {
      if (state.aviationAlerts === "pending") {
        state.aviationAlerts = "failed";
        state.aviationAlertsLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    discussionLoading: (state) => {
      switch (state.discussion) {
        case undefined:
          state.discussion = "pending";
          return;
        case "pending":
        case "not-available":
          return;
        case "failed":
        default: {
          if (
            !state.discussionLastUpdated ||
            Math.abs(
              differenceInMinutes(
                new Date(state.discussionLastUpdated),
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
          ) {
            state.discussion = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    discussionReceived: (state, action: PayloadAction<Discussion>) => {
      if (state.discussion === "pending") {
        state.discussion = action.payload;
        state.discussionLastUpdated = new Date().toISOString();
        state.discussionLastViewed = getDiscussionLastViewed(
          action.payload.issuingOffice,
        );
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    discussionFailed: (state) => {
      if (state.discussion === "pending") {
        state.discussion = "failed";
        state.discussionLastUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    discussionNotAvailable: (state) => {
      if (state.discussion === "pending") {
        state.discussion = "not-available";
        state.discussionLastUpdated = new Date().toISOString();
      }
    },

    setDiscussionViewed(state, action: PayloadAction<string>) {
      state.discussionLastViewed = action.payload;
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    windsAloftLoading: (state) => {
      switch (state.windsAloft) {
        case "failed":
        case undefined:
          state.windsAloft = "pending";
          return;
        case "pending":
          return;
        default: {
          if (
            !state.windsAloftUpdated ||
            Math.abs(
              differenceInMinutes(
                new Date(state.windsAloftUpdated),
                new Date(),
              ),
            ) > UPDATE_INTERVAL_MINUTES
          ) {
            state.windsAloft = "pending";
          }
        }
      }
    },

    /**
     * @param action Action containing payload as the Rap
     */
    windsAloftReceived: (state, action: PayloadAction<WindsAloftReport>) => {
      if (state.windsAloft === "pending") {
        state.windsAloft = action.payload;
        state.windsAloftUpdated = new Date().toISOString();
      }
    },

    /**
     * @param action Action containing payload as the URL of the rap resource
     */
    windsAloftFailed: (state) => {
      if (state.windsAloft === "pending") {
        state.windsAloft = "failed";
      }
    },

    updateCoordinates: (
      state,
      action: PayloadAction<{ lat: number; lon: number }>,
    ) => {
      state.coordinates = action.payload;
    },

    clear: () => initialState,
  },
});

export const {
  weatherResetLoading,
  weatherLoading,
  weatherReceived,
  timeZoneReceived,
  timeZoneFailed,
  elevationLoading,
  elevationReceived,
  elevationFailed,
  weatherFailed,
  alertsLoading,
  alertsReceived,
  alertsFailed,
  alertsNotAvailable,
  aviationWeatherLoading,
  aviationWeatherReceived,
  aviationWeatherFailed,
  aviationWeatherNotAvailable,
  aviationAlertsLoading,
  aviationAlertsReceived,
  aviationAlertsFailed,
  clear,
  discussionLoading,
  discussionReceived,
  discussionFailed,
  discussionNotAvailable,
  setDiscussionViewed,

  windsAloftLoading,
  windsAloftReceived,
  windsAloftFailed,

  updateCoordinates,
} = weatherReducer.actions;

export const getWeather =
  (lat: number, lon: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateCoordinates({ lat, lon }));
    dispatch(windsAloftLoading());

    const isPending = getState().weather.windsAloft === "pending";

    if (!isPending) return;

    if (!isPossiblyWithinUSA(lat, lon)) {
      dispatch(discussionLoading());
      dispatch(discussionNotAvailable());
      dispatch(alertsNotAvailable());

      loadTimezoneIfNeeded();

      loadAviationWeather();
      loadAviationAlerts();

      dispatch(windsAloftLoading());
      dispatch(weatherLoading());

      let windsAloft, weather, elevationInM;

      try {
        [{ windsAloft, elevationInM }, weather] = await Promise.all([
          openMeteo.getWindsAloft(lat, lon),
          openMeteo.getWeather(lat, lon),
        ]);
      } catch (error) {
        if (!isStale()) {
          dispatch(windsAloftFailed());
          dispatch(weatherFailed());
          dispatch(elevationFailed());
        }

        throw error;
      }

      if (isStale()) return;

      dispatch(windsAloftReceived(windsAloft));
      dispatch(weatherReceived(weather));
      dispatch(elevationReceived(elevationInM));

      return;
    }

    // Open Meteo can provide weather and elevation alongside winds aloft
    const windsAloft = await loadWindsAloft();

    if (isStale()) return;

    if (!windsAloft) return; // pending
    const { elevation } = windsAloft;

    if (elevation == null) loadElevation();
    else dispatch(elevationReceived(elevation));

    await Promise.all([
      loadNWSAlerts(),
      loadWeatherAndDiscussion(),
      loadAviationWeather(),
      loadAviationAlerts(),
    ]);

    async function loadWindsAloft(): Promise<
      | {
          elevation?: number;
        }
      | undefined
    > {
      if (!isWithinNWSRAPModelBoundary(lat, lon)) return fallback();

      try {
        const windsAloft = await rapidRefresh.getWindsAloft(lat, lon);

        if (
          windsAloft.hours.filter(({ date }) => !isPast(new Date(date)))
            .length < 10
        ) {
          console.info("Stale NWS rapid refresh data");
          throw new Error("Rapid Refresh is too old");
        }

        if (isStale()) return;

        dispatch(windsAloftReceived(windsAloft));
      } catch (error) {
        if (isStale()) return;

        return fallback();
      }

      return {};

      async function fallback() {
        try {
          // It would be nice in the future to intelligently choose an API
          // instead of trial and error (and, it would be faster)
          const { windsAloft } = await openMeteo.getWindsAloft(lat, lon);

          if (isStale()) return;

          dispatch(windsAloftReceived(windsAloft));

          return { elevation: windsAloft.elevationInM };
        } catch (error) {
          if (!isStale()) dispatch(windsAloftFailed());

          throw error;
        }
      }
    }

    async function loadPointData() {
      if (getState().weather.weather === "pending") return;
      dispatch(weatherLoading());
      if (getState().weather.weather !== "pending") return;

      try {
        let forecastGridDataUrl;
        try {
          const data = await nwsWeather.getPointResources({ lat, lon });

          forecastGridDataUrl = data.forecastGridDataUrl;

          if (isStale()) return;

          dispatch(timeZoneReceived(data.timeZone));
        } catch (e) {
          if (
            !(e instanceof AxiosError) &&
            !(e instanceof nwsWeather.InvalidPointResourceError)
          )
            throw e;

          await fallback();
          return;
        }

        if (forecastGridDataUrl) {
          let data;
          try {
            data = await nwsWeather.getGridData(forecastGridDataUrl);
          } catch (e) {
            if (!(e instanceof AxiosError)) throw e;

            await fallback();
            return;
          }

          if (isStale()) return;

          dispatch(weatherReceived(data));

          return data.properties.gridId;
        }
      } catch (e) {
        if (!isStale()) dispatch(weatherFailed());
        throw e;
      }

      async function fallback() {
        // Likely Mexico or Canada
        // We still need the timezone, so try to fall back anyways

        const weather = await openMeteo.getWeather(lat, lon);

        if (isStale()) return;

        dispatch(weatherReceived(weather));

        loadTimezoneIfNeeded();
      }
    }

    async function loadTimezoneIfNeeded() {
      if (getState().weather.timeZone) return;

      try {
        const timeZone = await timezoneService.get({ lat, lon });

        if (isStale()) return;

        dispatch(timeZoneReceived(timeZone));
      } catch (e) {
        if (!(e instanceof AxiosError)) throw e;

        if (!isStale()) dispatch(timeZoneFailed());

        throw e;
      }
    }

    async function loadNWSAlerts() {
      if (getState().weather.alerts === "pending") return;
      dispatch(alertsLoading());
      if (getState().weather.alerts !== "pending") return;

      try {
        const alerts = await nwsWeather.getAlerts({ lat, lon });

        if (isStale()) return;

        dispatch(alertsReceived(alerts));
      } catch (e: unknown) {
        if (isStale()) throw e;
        if (
          e instanceof AxiosError &&
          e.response?.status === 400 &&
          e.response.data.detail?.includes("out of bounds")
        )
          dispatch(alertsNotAvailable());
        else dispatch(alertsFailed());
        throw e;
      }
    }

    async function loadAviationWeather() {
      if (getState().weather.aviationWeather === "pending") return;
      dispatch(aviationWeatherLoading());
      if (getState().weather.aviationWeather !== "pending") return;

      try {
        const rawTAF = await aviationWeatherService.getTAF({ lat, lon });

        if (isStale()) return;

        if (!rawTAF) {
          dispatch(aviationWeatherNotAvailable());
        } else {
          dispatch(aviationWeatherReceived(rawTAF));
        }
      } catch (e: unknown) {
        if (!isStale()) dispatch(aviationWeatherFailed());
        throw e;
      }
    }

    async function loadAviationAlerts() {
      if (getState().weather.aviationAlerts === "pending") return;
      dispatch(aviationAlertsLoading());
      if (getState().weather.aviationAlerts !== "pending") return;

      try {
        const payload = await aviationWeatherService.getAviationAlerts({
          lat,
          lon,
        });

        if (isStale()) return;

        dispatch(aviationAlertsReceived(payload));
      } catch (e: unknown) {
        if (!isStale()) dispatch(aviationAlertsFailed());
        throw e;
      }
    }

    async function loadElevation() {
      if (getState().weather.elevationLoading) return;
      dispatch(elevationLoading());
      if (!getState().weather.elevationLoading) return;

      try {
        const elevation = await elevationService.getElevation({ lat, lon });

        if (isStale()) return;

        dispatch(elevationReceived(elevation));
      } catch (e: unknown) {
        try {
          const elevation = await elevationService.getBackupElevation({
            lat,
            lon,
          });

          if (isStale()) return;

          dispatch(elevationReceived(elevation));
        } catch (e) {
          if (!isStale()) dispatch(elevationFailed());
          throw e;
        }

        throw e;
      }
    }

    async function loadWeatherAndDiscussion() {
      const gridId = await loadPointData();

      if (isStale()) return;

      if (gridId) await loadDiscussionFromGridId(gridId);
      else {
        dispatch(discussionLoading());
        dispatch(discussionNotAvailable());
      }
    }

    async function loadDiscussionFromGridId(gridId: string) {
      if (getState().weather.discussion === "pending") return;
      dispatch(discussionLoading());
      if (getState().weather.discussion !== "pending") return;

      try {
        const discussion = await nwsWeather.getDiscussion(gridId);

        if (isStale()) return;

        if (!discussion) {
          dispatch(discussionNotAvailable());
        } else {
          dispatch(discussionReceived(discussion));
        }
      } catch (e: unknown) {
        if (!isStale()) dispatch(discussionFailed());
        throw e;
      }
    }

    function isStale() {
      if (!getState().weather.coordinates) return true;

      if (
        getState().weather.coordinates?.lat !== lat ||
        getState().weather.coordinates?.lon !== lon
      )
        return true;

      return false;
    }
  };

// Other code such as selectors can use the imported `RootState` type
export const currentWeather = (state: RootState) => state.weather.weather;

export const timeZoneSelector = (state: RootState) => {
  return state.weather.timeZone;
};

export default weatherReducer.reducer;

function getDiscussionLastViewed(issuingOffice: string): string {
  const discussionLastViewedByStation = storage.discussionLastViewedByStation();

  return discussionLastViewedByStation[issuingOffice];
}

// Other code such as selectors can use the imported `RootState` type
export const windsAloft = (state: RootState) => state.weather.windsAloft;
