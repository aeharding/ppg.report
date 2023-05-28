import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch, RootState } from "../../store";
import { Alert } from "../alerts/alertsSlice";
import * as storage from "./storage";
import { UserLocation } from "./storage";
import { Languages } from "../../i18n";
import { isBrowserLocaleClockType24h } from "../../helpers/device";

export enum AltitudeType {
  AGL = "AGL",
  MSL = "MSL",
}

export enum AltitudeLevels {
  Default = "Default",
  Normalized = "Normalized",
}

// CSS scroll-snap-stop
export enum OnOff {
  On = "On",
  Off = "Off",
}

export enum SpeedUnit {
  KPH = "km/h",
  MPH = "mph",
  Knots = "knots",
  mps = "m/s",
}

export enum HeightUnit {
  Feet = "ft",
  Meters = "m",
}

export enum TemperatureUnit {
  Celsius = "°C",
  Fahrenheit = "°F",
}

export enum DistanceUnit {
  Miles = "miles",
  Kilometers = "km",
}

export enum TimeFormat {
  TwentyFour = "24-hour",
  Twelve = "12-hour",
}

export const DEFAULT_HEIGHT_UNIT = (() => {
  switch (navigator.language) {
    case "zh-CN": // China (PRC)
    case "zh": // China (PRC)
    case "ko-KP": // North Korea
    case "ru-RU": // Russia
    case "ru": // Russia
      return HeightUnit.Meters;
    default:
      return HeightUnit.Feet;
  }
})();

export const DEFAULT_TEMPERATURE_UNIT = (() => {
  switch (navigator.language) {
    case "en":
    case "en-US": // United States
    case "en-AS": // American Samoa
    case "en-AI": // Anguilla
    case "en-BS": // Bahamas
    case "en-BM": // Bermuda
    case "en-KY": // Cayman Islands
    case "en-FK": // Falkland Islands
    case "en-GD": // Grenada
    case "en-GU": // Guam
    case "en-JM": // Jamaica
    case "en-MS": // Montserrat
    case "en-MH": // Marshall Islands
    case "en-FM": // Micronesia
    case "en-MP": // Northern Mariana Islands
    case "en-PW": // Palau
    case "en-PR": // Puerto Rico
    case "en-KN": // Saint Kitts and Nevis
    case "en-LC": // Saint Lucia
    case "en-VC": // Saint Vincent and the Grenadines
    case "en-TC": // Turks and Caicos Islands
    case "en-VI": // United States Virgin Islands
      return TemperatureUnit.Fahrenheit;
    default:
      return TemperatureUnit.Celsius;
  }
})();

export const DEFAULT_SPEED_UNIT = (() => {
  switch (navigator.language) {
    case "en":
    case "en-US": // United States
    case "en-GB": // United Kingdom
    case "cy-GB": // United Kingdom (Welsh)
    case "kw-GB": // United Kingdom (Cornish)
    case "gd-GB": // United Kingdom (Scottish Gaelic)
    case "en-AG": // Antigua and Barbuda
    case "en-BS": // Bahamas
    case "en-BZ": // Belize
    case "en-DM": // Dominica
    case "en-GD": // Grenada
    case "en-MH": // Marshall Islands
    case "en-FM": // Micronesia
    case "en-PW": // Palau
    case "en-KN": // Saint Kitts and Nevis
    case "en-LC": // Saint Lucia
    case "en-VC": // Saint Vincent and the Grenadines
    case "en-WS": // Samoa
    case "en-AI": // Anguilla
    case "en-VG": // British Virgin Islands
    case "en-IO": // British Indian Ocean Territory
    case "en-KY": // Cayman Islands
    case "en-FK": // Falkland Islands
    case "en-MS": // Montserrat
    case "en-SH": // Saint Helena, Ascension and Tristan da Cunha
    case "en-TC": // Turks and Caicos Islands
    case "en-GG": // Bailiwick of Guernsey
    case "en-IM": // Isle of Man
    case "en-JE": // Jersey
    case "en-AS": // American Samoa
    case "en-GU": // Guam
    case "en-MP": // Northern Mariana Islands
    case "en-PR": // Puerto Rico
    case "en-VI": // United States Virgin Islands
      return SpeedUnit.MPH;
    case "sv-SE": // Sweden
    case "nb-NO": // Norway
    case "nn-NO": // Norway
    case "se-NO": // Norway
    case "fi-FI": // Finland
    case "da-DK": // Denmark
    case "en-DK": // Denmark
    case "fo-DK": // Denmark
    case "is-IS": // Iceland
    case "et-EE": // Estonia
    case "lv-LV": // Latvia
    case "lt-LT": // Lithuania
    case "be-BY": // Belarus
    case "uk-UA": // Ukraine
    case "ru-RU": // Russia
    case "kk-KZ": // Kazakhstan
    case "uz-UZ": // Uzbekistan
    case "ky-KG": // Kyrgyzstan
    case "tg-TJ": // Tajikistan
    case "tk-TM": // Turkmenistan
    case "ps-AF": // Afghanistan
    case "mn-MN": // Mongolia
    case "zh-CN": // China (PRC)
    case "ko-KP": // North Korea
    case "ko-KR": // South Korea
    case "ja-JP": // Japan
    case "vi-VN": // Vietnam
    case "lo-LA": // Laos
    case "km-KH": // Cambodia
    case "th-TH": // Thailand
    case "my-MM": // Myanmar (Burma)
    case "ne-NP": // Nepal
    case "dz-BT": // Bhutan
    case "en-IN": // India
    case "bn-BD": // Bangladesh
    case "si-LK": // Sri Lanka
    case "dv-MV": // Maldives
    case "ur-PK": // Pakistan
    case "fa-IR": // Iran
    case "ar-IQ": // Iraq
    case "ar-JO": // Jordan
    case "ar-LB": // Lebanon
    case "ar-SY": // Syria
    case "ar-SA": // Saudi Arabia
    case "ar-KW": // Kuwait
    case "ar-QA": // Qatar
    case "ar-BH": // Bahrain
    case "ar-AE": // United Arab Emirates
    case "ar-OM": // Oman
    case "ar-YE": // Yemen
    case "tr-TR": // Turkey
    case "el-CY": // Cyprus
    case "nn": // Norwegian Nynorsk
    case "nb": // Norwegian Bokmål
    case "is": // Icelandic
    case "sv": // Swedish
    case "fi": // Finnish
    case "ru": // Russian
    case "kk": // Kazakh
    case "uz": // Uzbek
    case "ky": // Kyrgyz
    case "tg": // Tajik
    case "ps": // Pashto
    case "mn": // Mongolian
    case "zh": // Chinese
    case "ko": // Korean
    case "ja": // Japanese
    case "vi": // Vietnamese
    case "lo": // Lao
    case "km": // Khmer (Cambodian)
    case "th": // Thai
    case "my": // Burmese
    case "ne": // Nepali
    case "dz": // Dzongkha
    case "bn": // Bengali
    case "si": // Sinhala
    case "dv": // Dhivehi
    case "ur": // Urdu
    case "fa": // Persian
    case "ar": // Arabic
    case "tr": // Turkish
    case "el": // Greek
      return SpeedUnit.mps;
    default:
      return SpeedUnit.KPH;
  }
})();

export const DEFAULT_DISTANCE_UNIT: DistanceUnit = (() => {
  switch (DEFAULT_SPEED_UNIT) {
    case SpeedUnit.MPH:
      return DistanceUnit.Miles;
    case SpeedUnit.KPH:
    case SpeedUnit.mps:
      return DistanceUnit.Kilometers;
  }
})();

export const DEFAULT_TIME_FORMAT = (() => {
  if (isBrowserLocaleClockType24h()) {
    return TimeFormat.TwentyFour;
  }

  return TimeFormat.Twelve;
})();

export function toggle(altitude: AltitudeType): AltitudeType {
  switch (altitude) {
    case AltitudeType.AGL:
      return AltitudeType.MSL;
    case AltitudeType.MSL:
      return AltitudeType.AGL;
  }
}

interface UserState {
  recentLocations: UserLocation[];
  altitude: AltitudeType;
  altitudeLevels: AltitudeLevels;
  heightUnit: HeightUnit;
  speedUnit: SpeedUnit;
  temperatureUnit: TemperatureUnit;
  distanceUnit: DistanceUnit;
  timeFormat: TimeFormat;
  readAlerts: Record<string, string>;
  hiddenAlerts: Record<string, true>;
  swipeInertia: OnOff;
  gAirmetRead: OnOff;
  language: Languages;
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
  altitude: storage.getAltitude(),
  altitudeLevels: storage.getAltitudeLevels(),
  heightUnit: storage.getHeightUnit(),
  speedUnit: storage.getSpeedUnit(),
  temperatureUnit: storage.getTemperatureUnit(),
  distanceUnit: storage.getDistanceUnit(),
  timeFormat: storage.getTimeFormat(),
  readAlerts: storage.getReadAlerts(),
  hiddenAlerts: storage.getHiddenAlerts(),
  swipeInertia: storage.getSwipeInertia(),
  gAirmetRead: storage.getGAirmetRead(),
  language: storage.getLanguage(),
};

/**
 * User preferences
 */
export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateLocations(state, action: PayloadAction<UserLocation[]>) {
      state.recentLocations = action.payload;
    },
    toggleAltitude(state) {
      state.altitude = toggle(state.altitude);
    },
    updateAltitude(state, action: PayloadAction<AltitudeType>) {
      state.altitude = action.payload;
    },
    updateAltitudeLevels(state, action: PayloadAction<AltitudeLevels>) {
      state.altitudeLevels = action.payload;
    },
    updateHeightUnit(state, action: PayloadAction<HeightUnit>) {
      state.heightUnit = action.payload;
    },
    updateSpeedUnit(state, action: PayloadAction<SpeedUnit>) {
      state.speedUnit = action.payload;
    },
    updateTemperatureUnit(state, action: PayloadAction<TemperatureUnit>) {
      state.temperatureUnit = action.payload;
    },
    updateDistanceUnit(state, action: PayloadAction<DistanceUnit>) {
      state.distanceUnit = action.payload;
    },
    updateTimeFormat(state, action: PayloadAction<TimeFormat>) {
      state.timeFormat = action.payload;
    },
    readAlert(state, action: PayloadAction<Alert>) {
      state.readAlerts = storage.setReadAlert(action.payload);
    },
    hideAlert(state, action: PayloadAction<Alert>) {
      state.hiddenAlerts = storage.setHiddenAlert(action.payload);
    },
    resetHiddenAlerts(state) {
      storage.resetHiddenAlerts();
      state.hiddenAlerts = {};
    },
    setSwipeInertia(state, action: PayloadAction<OnOff>) {
      state.swipeInertia = storage.setSwipeInertia(action.payload);
    },
    setGAirmetRead(state, action: PayloadAction<OnOff>) {
      state.gAirmetRead = storage.setGAirmetRead(action.payload);
    },
    updateLanguage(state, action: PayloadAction<Languages>) {
      state.language = action.payload;
    },
  },
});

export const {
  updateLocations,
  readAlert,
  hideAlert,
  resetHiddenAlerts,
  setSwipeInertia,
  setGAirmetRead,
} = userReducer.actions;

export const toggleAltitude =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.toggleAltitude());

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitude =
  (altitude: AltitudeType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateAltitude(altitude));

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitudeLevels =
  (altitudeLevels: AltitudeLevels) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateAltitudeLevels(altitudeLevels));

    storage.setAltitudeLevels(getState().user.altitudeLevels);
  };

export const setHeightUnit =
  (altitude: HeightUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateHeightUnit(altitude));

    storage.setHeightUnit(getState().user.heightUnit);
  };

export const setSpeedUnit =
  (speedUnit: SpeedUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateSpeedUnit(speedUnit));

    storage.setSpeedUnit(getState().user.speedUnit);
  };

export const setTemperatureUnit =
  (temperatureUnit: TemperatureUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateTemperatureUnit(temperatureUnit));

    storage.setTemperatureUnit(getState().user.temperatureUnit);
  };

export const setDistanceUnit =
  (distanceUnit: DistanceUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateDistanceUnit(distanceUnit));

    storage.setDistanceUnit(getState().user.distanceUnit);
  };

export const setTimeFormat =
  (timeFormat: TimeFormat) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateTimeFormat(timeFormat));

    storage.setTimeFormat(getState().user.timeFormat);
  };

export const visitedLocation =
  (geocode: Geocode) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.visitedLocation({
      ...geocode,
      lastVisited: Date.now(),
    });

    dispatch(updateLocations(updatedLocations));
  };

export const removeLocation =
  (location: UserLocation) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.removeLocation(location);

    dispatch(updateLocations(updatedLocations));
  };

export const setLanguage =
  (language: Languages) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateLanguage(language));

    storage.setLanguage(getState().user.language);
  };

export default userReducer.reducer;
