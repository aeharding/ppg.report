import { createSelector } from "@reduxjs/toolkit";
import { addHours } from "date-fns";
import {
  AviationAlertFeature,
  GAirmetFeature,
  SigmetFeature,
} from "../../services/aviationWeather";
import { TFRFeature } from "../../services/faa";
import { RootState } from "../../store";
import { WeatherAlertFeature } from "../weather/weatherSlice";

const weatherAlertsSelector = (state: RootState) => state.weather.alerts;
const tfrsSelector = (state: RootState) => state.faa.tfrs;
const aviationAlertsSelector = (state: RootState) =>
  state.weather.aviationAlerts;

export type Alert = WeatherAlertFeature | TFRFeature | AviationAlertFeature;

export const alertsSelector = createSelector(
  [weatherAlertsSelector, tfrsSelector, aviationAlertsSelector],
  (weatherAlerts, tfrs, aviationAlerts) => {
    if (
      !weatherAlerts ||
      weatherAlerts === "pending" ||
      weatherAlerts === "failed" ||
      !tfrs ||
      tfrs === "pending" ||
      tfrs === "failed" ||
      !aviationAlerts ||
      aviationAlerts === "pending" ||
      aviationAlerts === "failed" ||
      aviationAlerts === "not-available"
    )
      return;

    return [...weatherAlerts.features, ...tfrs, ...aviationAlerts];
  }
);

export function isWeatherAlert(alert: Alert): alert is WeatherAlertFeature {
  return "parameters" in alert.properties;
}

export function isTFRAlert(alert: Alert): alert is TFRFeature {
  return "coreNOTAMData" in alert.properties;
}

export function isSigmetAlert(alert: Alert): alert is SigmetFeature {
  return "data" in alert.properties && alert.properties.data === "SIGMET";
}

export function isGAirmetAlert(alert: Alert): alert is GAirmetFeature {
  return "data" in alert.properties && alert.properties.data === "GAIRMET";
}

export function getAlertStart(alert: Alert) {
  if (isWeatherAlert(alert)) return alert.properties.onset;

  if (isTFRAlert(alert))
    return alert.properties.coreNOTAMData.notam.effectiveStart;

  if (isGAirmetAlert(alert)) return alert.properties.validTime;

  return alert.properties.validTimeFrom;
}

export function getAlertEnd(alert: Alert) {
  if (isWeatherAlert(alert))
    return alert.properties.ends || alert.properties.expires;

  if (isTFRAlert(alert)) {
    if (alert.properties.coreNOTAMData.notam.effectiveEnd === "PERM") {
      return undefined;
    }

    return alert.properties.coreNOTAMData.notam.effectiveEnd;
  }

  if (isGAirmetAlert(alert))
    return addHours(new Date(alert.properties.validTime), 3).toISOString();

  return alert.properties.validTimeTo;
}
