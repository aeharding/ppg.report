import axios from "axios";
import { WindsAloftAltitude, WindsAloftReport } from "../models/WindsAloft";
import {
  convertToInterpolatorWithHeight,
  interpolateWindVectors,
} from "../helpers/interpolate";
import { notEmpty } from "../helpers/array";
import zipObject from "lodash/zipObject";
import * as velitherm from "velitherm";

const FORECAST_DAYS = 2;

/**
 * in hPa
 */
const PRESSURE_ALTITUDES = [
  1000, 975, 950, 925, 900, 850, 800, 700, 600, 500, 400, 300, 250,
] as const;

const PRESSURE_ALTITUDE_METRICS = [
  "temperature",
  "wind_speed",
  "wind_direction",
  "geopotential_height",
  "relative_humidity",
] as const;

/**
 * in meters
 */
const AGL_ALTITUDES = [80, 120, 180] as const;

const AGL_METRICS = ["wind_speed", "wind_direction", "temperature"] as const;

const SPECIAL_ALOFT_VARIABLES = [
  "cape",
  "convective_inhibition",

  "temperature_2m",
  "dew_point_2m",
  "relative_humidity_2m",
  "surface_pressure",
  "pressure_msl",

  // No temperature_10m, so have to break it out from AGL_ALTITUDES
  // (will fudge it and use temperature_2m)
  "wind_direction_10m",
  "wind_speed_10m",
  "wind_gusts_10m",
] as const;

const WEATHER_VARIABLES = [
  "precipitation_probability",
  "weather_code",
  "cloud_cover",
  "temperature",

  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
] as const;

type HourlyPressureParams =
  | `${(typeof PRESSURE_ALTITUDE_METRICS)[number]}_${(typeof PRESSURE_ALTITUDES)[number]}hPa`
  | `${(typeof AGL_METRICS)[number]}_${(typeof AGL_ALTITUDES)[number]}m`
  | (typeof SPECIAL_ALOFT_VARIABLES)[number];

type HourlyWeatherParams = (typeof WEATHER_VARIABLES)[number];

interface OpenMeteoResponse<Params extends string> {
  timezone: string;
  elevation: number;
  longitude: number;
  latitude: number;
  hourly: Record<"time" | Params, number[]>;
}

export interface OpenMeteoWeather {
  byUnixTimestamp: Record<string, OpenMeteoWeatherHour | undefined>;
}

interface OpenMeteoWeatherHour {
  precipitationChance: number;
  weather: number;
  /** kph */
  windSpeed: number;
  /** kph */
  windGust: number;
  cloudCover: number;
  windDirection: number;
  temperature: number;
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoWeather> {
  return convertOpenMeteoToWeather(
    (
      await axios.get("/api/openmeteo/forecast", {
        params: {
          latitude,
          longitude,
          forecast_days: FORECAST_DAYS,
          timeformat: "unixtime",
          hourly: generateWeatherParams().join(","),
        },
      })
    ).data,
  );
}

export async function getWindsAloft(
  latitude: number,
  longitude: number,
): Promise<{
  windsAloft: WindsAloftReport;
  weather: OpenMeteoWeather;
  elevationInM: number;
}> {
  const openMeteoResponse = await getOpenMeteoWindsAloft(latitude, longitude);

  return {
    windsAloft: interpolate(convertOpenMeteoToWindsAloft(openMeteoResponse)),
    weather: convertOpenMeteoToWeather(openMeteoResponse),
    elevationInM: openMeteoResponse.elevation,
  };
}

function convertOpenMeteoToWeather(
  openMeteoResponse: OpenMeteoResponse<HourlyWeatherParams>,
): OpenMeteoWeather {
  return {
    byUnixTimestamp: zipObject(
      openMeteoResponse.hourly.time,
      openMeteoResponse.hourly.time.map((_, index) => ({
        precipitationChance:
          openMeteoResponse.hourly.precipitation_probability[index],
        weather: openMeteoResponse.hourly.weather_code[index],
        windSpeed: openMeteoResponse.hourly.wind_speed_10m[index],
        windGust: openMeteoResponse.hourly.wind_gusts_10m[index],
        windDirection: openMeteoResponse.hourly.wind_direction_10m[index],
        cloudCover: openMeteoResponse.hourly.cloud_cover[index],
        temperature: openMeteoResponse.hourly.temperature[index],
      })),
    ),
  };
}

function interpolate(report: WindsAloftReport): WindsAloftReport {
  const lowestAltitudeMsl =
    (report.elevationInM ?? 0) + Math.max(...AGL_ALTITUDES);

  return {
    ...report,
    hours: report.hours.map((hour) => ({
      ...hour,
      altitudes: (() => {
        const ditheredAltitudes: WindsAloftAltitude[] = [];

        for (let i = 0; i < hour.altitudes.length; i++) {
          ditheredAltitudes.push(hour.altitudes[i]);

          if (!hour.altitudes[i + 1]) continue;
          if (hour.altitudes[i].altitudeInM <= lowestAltitudeMsl) continue;

          const middleAltitude =
            (hour.altitudes[i].altitudeInM +
              hour.altitudes[i + 1].altitudeInM) /
            2;

          const { height, speed, direction } = interpolateWindVectors(
            convertToInterpolatorWithHeight(hour.altitudes[i]),
            convertToInterpolatorWithHeight(hour.altitudes[i + 1]),
            middleAltitude,
          );

          const temperatureInC = Math.round(
            (hour.altitudes[i].temperatureInC +
              hour.altitudes[i + 1].temperatureInC) /
              2,
          );

          ditheredAltitudes.push({
            windSpeedInKph: Math.round(speed * 10) / 10,
            windDirectionInDeg: Math.round(direction),
            altitudeInM: Math.round(height),
            temperatureInC,
            dewpointInC: Math.round(
              (hour.altitudes[i].dewpointInC +
                hour.altitudes[i + 1].dewpointInC) /
                2,
            ),
            pressure: Math.round(
              (hour.altitudes[i].pressure + hour.altitudes[i + 1].pressure) / 2,
            ),
          });
        }

        return ditheredAltitudes;
      })(),
    })),
  };
}

async function getOpenMeteoWindsAloft(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoResponse<HourlyPressureParams | HourlyWeatherParams>> {
  return (
    await axios.get("/api/openmeteo/forecast", {
      params: {
        latitude,
        longitude,
        forecast_days: FORECAST_DAYS,
        timeformat: "unixtime",
        hourly: [
          ...generateWindsAloftParams(),
          ...generateWeatherParams(),
        ].join(","),
      },
    })
  ).data;
}

function convertOpenMeteoToWindsAloft(
  openMeteoResponse: OpenMeteoResponse<HourlyPressureParams>,
): WindsAloftReport {
  let pressureAltitudeHours = openMeteoResponse.hourly.time.map((time, index) =>
    PRESSURE_ALTITUDES.map((pressureAltitude) => ({
      altitudeInM:
        openMeteoResponse.hourly[`geopotential_height_${pressureAltitude}hPa`][
          index
        ],
      windSpeedInKph:
        openMeteoResponse.hourly[`wind_speed_${pressureAltitude}hPa`][index],
      windDirectionInDeg:
        openMeteoResponse.hourly[`wind_direction_${pressureAltitude}hPa`][
          index
        ],
      temperatureInC:
        openMeteoResponse.hourly[`temperature_${pressureAltitude}hPa`][index],
      pressure: pressureAltitude,
      dewpointInC: velitherm.dewPoint(
        openMeteoResponse.hourly[`relative_humidity_${pressureAltitude}hPa`][
          index
        ],
        openMeteoResponse.hourly[`temperature_${pressureAltitude}hPa`][index],
      ),
    })),
  );

  const lowestAltitudeMsl =
    openMeteoResponse.elevation + Math.max(...AGL_ALTITUDES);

  const lowestElgibleIndexToShow = Math.max(
    ...pressureAltitudeHours
      .map((altitudes) => {
        for (let index = 0; index < altitudes.length; index++) {
          const altitude = altitudes[index];
          if (altitude.altitudeInM > lowestAltitudeMsl) return index;
        }

        return undefined;
      })
      .filter(notEmpty),
  );

  pressureAltitudeHours = pressureAltitudeHours.map((hour) =>
    hour.slice(lowestElgibleIndexToShow),
  );

  return {
    latitude: openMeteoResponse.latitude,
    longitude: openMeteoResponse.longitude,
    elevationInM: openMeteoResponse.elevation,
    source: "openMeteo",
    hours: openMeteoResponse.hourly.time.map((time, index) => {
      return {
        date: new Date(time * 1_000).toISOString(),
        cape: openMeteoResponse.hourly.cape[index],
        cin: openMeteoResponse.hourly.convective_inhibition[index],
        altitudes: [
          {
            altitudeInM: openMeteoResponse.elevation,
            windSpeedInKph: openMeteoResponse.hourly.wind_speed_10m[index],
            windDirectionInDeg:
              openMeteoResponse.hourly.wind_direction_10m[index],
            temperatureInC: openMeteoResponse.hourly.temperature_2m[index],
            dewpointInC: openMeteoResponse.hourly.dew_point_2m[index],
            pressure: Math.round(
              openMeteoResponse.hourly.surface_pressure[index],
            ),
          },
        ]
          .concat(
            AGL_ALTITUDES.map((agl) => ({
              altitudeInM: openMeteoResponse.elevation + agl,
              windSpeedInKph:
                openMeteoResponse.hourly[`wind_speed_${agl}m`][index],
              windDirectionInDeg:
                openMeteoResponse.hourly[`wind_direction_${agl}m`][index],
              temperatureInC:
                openMeteoResponse.hourly[`temperature_${agl}m`][index],
              dewpointInC: velitherm.dewPoint(
                calculateRelativeHumidity(
                  agl,
                  openMeteoResponse.hourly[`surface_pressure`][index],
                  openMeteoResponse.hourly[`temperature_${agl}m`][index],
                  openMeteoResponse.hourly[`relative_humidity_2m`][index],
                ),
                openMeteoResponse.hourly[`temperature_${agl}m`][index],
              ),
              pressure: Math.round(
                velitherm.pressureFromAltitude(
                  agl,
                  openMeteoResponse.hourly["pressure_msl"][index],
                ),
              ),
            })),
          )
          .concat(pressureAltitudeHours[index]),
      };
    }),
  };
}

function generateWindsAloftParams(): HourlyPressureParams[] {
  const result: HourlyPressureParams[] = [];

  for (const pressure of PRESSURE_ALTITUDES) {
    for (const metric of PRESSURE_ALTITUDE_METRICS) {
      result.push(
        `${metric as (typeof PRESSURE_ALTITUDE_METRICS)[number]}_${
          pressure as unknown as (typeof PRESSURE_ALTITUDES)[number]
        }hPa`,
      );
    }
  }

  for (const pressure of AGL_ALTITUDES) {
    for (const metric of AGL_METRICS) {
      result.push(
        `${metric as (typeof AGL_METRICS)[number]}_${
          pressure as unknown as (typeof AGL_ALTITUDES)[number]
        }m`,
      );
    }
  }

  result.push(...SPECIAL_ALOFT_VARIABLES);

  return result;
}

function generateWeatherParams(): HourlyWeatherParams[] {
  return WEATHER_VARIABLES.slice();
}

function calculateRelativeHumidity(
  altitude: number,
  basePressure: number,
  baseTemperature: number,
  baseRH: number,
): number {
  // Calculate the pressure at the given altitude
  const pressure = velitherm.pressureFromAltitude(
    altitude,
    basePressure,
    baseTemperature,
  );

  // Calculate the temperature at the given altitude
  const temperature = baseTemperature - altitude * velitherm.gamma;

  // Calculate the specific humidity at the given temperature and pressure
  const specificHumidity = velitherm.specificHumidity(
    baseRH,
    pressure,
    temperature,
  );

  // Calculate the new relative humidity at the given altitude
  const relativeHumidity = velitherm.relativeHumidity(
    specificHumidity,
    pressure,
    temperature,
  );

  return relativeHumidity;
}
