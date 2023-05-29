import { createSelector } from "@reduxjs/toolkit";
import { ParseError, parseMetar, parseTAFAsForecast } from "metar-taf-parser";
import { RootState } from "../../store";

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
      return parseTAFAsForecast(aviationWeather.taf.raw, {
        issued: new Date(aviationWeather.taf.issued),
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

export const metarReport = createSelector(
  [tafReportSelector],
  (aviationWeather) => {
    if (
      !aviationWeather ||
      aviationWeather === "pending" ||
      aviationWeather === "failed" ||
      aviationWeather === "not-available" ||
      !aviationWeather.metar
    )
      return;

    try {
      return parseMetar(aviationWeather.metar.raw, {
        issued: new Date(aviationWeather.metar.observed),
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
