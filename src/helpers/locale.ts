import {
  AltitudeType,
  HeightUnit,
  TemperatureUnit,
  DistanceUnit,
  TimeFormat,
  SpeedUnit,
} from "../features/rap/extra/settings/settingEnums";
import { isBrowserLocaleClockType24h } from "./device";

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

export function toggleAltitudeType(altitude: AltitudeType): AltitudeType {
  switch (altitude) {
    case AltitudeType.AGL:
      return AltitudeType.MSL;
    case AltitudeType.MSL:
      return AltitudeType.AGL;
  }
}
