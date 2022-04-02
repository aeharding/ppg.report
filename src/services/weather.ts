import axios from "axios";
import { addSeconds } from "date-fns";
import {
  Alerts,
  Property,
  Value,
  Weather,
} from "../features/weather/weatherSlice";
import { parse, toSeconds } from "iso8601-duration";
import axiosRetryEnhancer from "axios-retry";
import { isWithinInterval } from "../helpers/date";

const axiosRetry = axios.create();

/**
 * "The gridpoints endpoint returns a 500 error. Retrying the request generally returns valid data."
 *
 * https://www.weather.gov/documentation/services-web-api#/default/alerts_active_zone
 */
axiosRetryEnhancer(axiosRetry, {
  retries: 5,
  retryCondition: (error) => error.response?.status === 500,
});

export async function get({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<Weather> {
  const { forecastGridDataUrl } = await getPointResources({ lat, lon });

  let { data } = await axiosRetry.get(forecastGridDataUrl);

  return data;
}

export async function getAlerts({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<Alerts> {
  const { data } = await axios.get(`/api/weather/alerts/active`, {
    params: {
      point: `${lat},${lon}`,
      message_type: "alert",
      status: "actual",
    },
  });

  return data;
}

async function getPointResources({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<{ forecastGridDataUrl: string }> {
  let { data } = await axios.get(`/api/weather/points/${lat},${lon}`);

  return { forecastGridDataUrl: normalize(data.properties.forecastGridData) };
}

/**
 * @param url NOAA url, like https://api.weather.gov/points
 * @returns Relative url, like /api/weather/points
 */
function normalize(url: string): string {
  const { pathname } = new URL(url);

  return `/api/weather${pathname}`;
}

export function findValue(date: Date, property: Property): Value | undefined {
  return property.values.find(({ validTime }) =>
    isBetweenWxTime(validTime, date)
  );
}

function isBetweenWxTime(weatherInterval: string, date: Date): boolean {
  const [start, duration] = weatherInterval.split("/");

  const end = addSeconds(new Date(start), toSeconds(parse(duration)));

  return isWithinInterval(date, { start: new Date(start), end });
}
