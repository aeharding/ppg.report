import { createSelector } from "@reduxjs/toolkit";
import { TFRFeature } from "../../services/faa";
import { RootState } from "../../store";
import { WeatherAlertFeature } from "../weather/weatherSlice";

const weatherAlertsSelector = (state: RootState) => state.weather.alerts;
const tfrsSelector = (state: RootState) => state.faa.tfrs;

export const alertsSelector = createSelector(
  [weatherAlertsSelector, tfrsSelector],
  (weatherAlerts, tfrs) => {
    if (
      !weatherAlerts ||
      weatherAlerts === "pending" ||
      weatherAlerts === "failed" ||
      !tfrs ||
      tfrs === "pending" ||
      tfrs === "failed"
    )
      return;

    return [...weatherAlerts.features, ...tfrs];
  }
);

export function isWeatherAlert(
  alert: TFRFeature | WeatherAlertFeature
): alert is WeatherAlertFeature {
  return "severity" in alert.properties;
}
