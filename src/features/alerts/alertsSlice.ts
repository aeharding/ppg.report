import { createSelector } from "@reduxjs/toolkit";
import { AirSigmetFeature } from "../../services/aviationWeather";
import { TFRFeature } from "../../services/faa";
import { RootState } from "../../store";
import { WeatherAlertFeature } from "../weather/weatherSlice";

const weatherAlertsSelector = (state: RootState) => state.weather.alerts;
const tfrsSelector = (state: RootState) => state.faa.tfrs;
const airSigmetsSelector = (state: RootState) => state.weather.airSigmets;

export type Alert = WeatherAlertFeature | TFRFeature | AirSigmetFeature;

export const alertsSelector = createSelector(
  [weatherAlertsSelector, tfrsSelector, airSigmetsSelector],
  (weatherAlerts, tfrs, airSigmets) => {
    if (
      !weatherAlerts ||
      weatherAlerts === "pending" ||
      weatherAlerts === "failed" ||
      !tfrs ||
      tfrs === "pending" ||
      tfrs === "failed" ||
      !airSigmets ||
      airSigmets === "pending" ||
      airSigmets === "failed" ||
      airSigmets === "not-available"
    )
      return;

    return [...weatherAlerts.features, ...tfrs, ...airSigmets];
  }
);

export function isWeatherAlert(alert: Alert): alert is WeatherAlertFeature {
  return "severity" in alert.properties;
}

export function isTFRAlert(alert: Alert): alert is TFRFeature {
  return "coreNOTAMData" in alert.properties;
}

export function getAlertStart(alert: Alert) {
  if (isWeatherAlert(alert)) return alert.properties.onset;

  if (isTFRAlert(alert))
    return alert.properties.coreNOTAMData.notam.effectiveStart;

  return alert.properties.from;
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

  return alert.properties.to;
}
