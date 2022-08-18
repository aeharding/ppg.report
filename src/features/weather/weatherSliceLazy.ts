import { createSelector } from "@reduxjs/toolkit";
import { ParseError, parseTAFAsForecast } from "metar-taf-parser";
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
      return parseTAFAsForecast(aviationWeather.raw, {
        issued: new Date(aviationWeather.issued),
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
