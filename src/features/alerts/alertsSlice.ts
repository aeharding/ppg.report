import { createSelector } from "@reduxjs/toolkit";
import { addHours } from "date-fns";
import { getAlertId } from "../../helpers/alert";
import { findRelatedAlerts } from "../../helpers/weather";
import {
  AviationAlertFeature,
  GAirmetFeature,
  ISigmetFeature,
  SigmetFeature,
} from "../../services/aviationWeather";
import { TFRFeature } from "../../services/faa";
import { WeatherAlertFeature } from "../../services/nwsWeather";
import { RootState } from "../../store";

const weatherAlertsSelector = (state: RootState) => state.weather.alerts;
const tfrsSelector = (state: RootState) => state.faa.tfrs;
const aviationAlertsSelector = (state: RootState) =>
  state.weather.aviationAlerts;
export const hiddenAlertsSelector = (state: RootState) =>
  state.user.hiddenAlerts;

export type Alert = WeatherAlertFeature | TFRFeature | AviationAlertFeature;

const allAlertsSelector = createSelector(
  [weatherAlertsSelector, tfrsSelector, aviationAlertsSelector],
  (weatherAlerts, tfrs, aviationAlerts) => {
    if (
      !weatherAlerts ||
      weatherAlerts === "pending" ||
      !tfrs ||
      tfrs === "pending" ||
      !aviationAlerts ||
      aviationAlerts === "pending" ||
      aviationAlerts === "not-available"
    )
      return;

    return [
      ...(weatherAlerts === "failed" || weatherAlerts === "not-available"
        ? []
        : weatherAlerts.features),
      ...(tfrs === "failed" ? [] : tfrs),
      ...(aviationAlerts === "failed" ? [] : aviationAlerts),
    ];
  }
);

export const alertsSelector = createSelector(
  [allAlertsSelector, hiddenAlertsSelector],
  (allAlerts, hiddenAlerts) => {
    const isHidden = generateIsHiddenFunction(hiddenAlerts);

    return allAlerts?.filter((alert) => !isHidden(alert));
  }
);

export const hiddenAlertsForLocationSelector = createSelector(
  [allAlertsSelector, hiddenAlertsSelector],
  (allAlerts, hiddenAlerts) => {
    return allAlerts?.filter(generateIsHiddenFunction(hiddenAlerts));
  }
);

function generateIsHiddenFunction(
  hiddenAlerts: Record<string, true>
): (alert: Alert) => boolean {
  return (alert) => hiddenAlerts[getAlertId(alert)];
}

export function isWeatherAlert(alert: Alert): alert is WeatherAlertFeature {
  return "parameters" in alert.properties;
}

export function isTFRAlert(alert: Alert): alert is TFRFeature {
  return "coreNOTAMData" in alert.properties;
}

export function isSigmetAlert(alert: Alert): alert is SigmetFeature {
  return "data" in alert.properties && alert.properties.data === "SIGMET";
}

export function isISigmetAlert(alert: Alert): alert is ISigmetFeature {
  return "data" in alert.properties && alert.properties.data === "ISIGMET";
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
  if (isWeatherAlert(alert)) return alert.properties.ends;

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

export function getGroupedGAirmetAlertStart(
  alert: GAirmetFeature,
  alerts: Alert[]
) {
  const related = findRelatedAlerts(alert, alerts);

  return getAlertStart(related[0]);
}

export function getGroupedGAirmetAlertEnd(
  alert: GAirmetFeature,
  alerts: Alert[]
) {
  const related = findRelatedAlerts(alert, alerts);

  return getAlertEnd(related[related.length - 1]);
}

/**
 * Convective SIGMETs override convective outlooks, so if one exists,
 * filter out the outlook
 *
 * This prevents redundant alerts that can be annoying
 * (it's only like a 5 minute overlap)
 *
 * @param alerts a set of alerts for a given hour
 */
export function filterDuplicateAlertsForHour(alerts: Alert[]): Alert[] {
  const hasConvectiveSigmet = !!alerts.find(
    (alert) =>
      isSigmetAlert(alert) &&
      alert.properties.airSigmetType === "SIGMET" &&
      alert.properties.hazard === "CONVECTIVE"
  );

  if (!hasConvectiveSigmet) return alerts;

  return alerts.filter(
    (alert) =>
      !(isSigmetAlert(alert) && alert.properties.airSigmetType === "OUTLOOK")
  );
}
