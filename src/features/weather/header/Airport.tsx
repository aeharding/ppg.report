import React, { useMemo } from "react";
import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import {
  CloudQuantity,
  getCompositeForecastForDate,
  ICloud,
  ICompositeForecast,
  IForecastContainer,
  TimestampOutOfBoundsError,
  Visibility,
} from "metar-taf-parser";
import { Micro } from "../WeatherHeader";

enum FlightCategory {
  VFR = "VFR",
  MVFR = "MVFR",
  IFR = "IFR",
  LIFR = "LIFR",
}

interface AirportContainerProps {
  category: FlightCategory;
}

const AirportContainer = styled.span<AirportContainerProps>`
  font-size: 0.7em;
  border-radius: 3px;
  padding: 0 1px;

  ${({ category }) => {
    switch (category) {
      case FlightCategory.LIFR:
        return css`
          ${outputP3ColorFromRGB([255, 0, 255])}
          border: 1px solid;
          ${outputP3ColorFromRGB([255, 0, 255], "border-color")}
        `;
      case FlightCategory.IFR:
        return css`
          ${outputP3ColorFromRGB([255, 0, 0])}
          border: 1px solid;
          ${outputP3ColorFromRGB([255, 0, 0], "border-color")}
        `;
      case FlightCategory.MVFR:
        return css`
          ${outputP3ColorFromRGB([0, 150, 255])}
          border: 1px solid;
          ${outputP3ColorFromRGB([0, 150, 255], "border-color")}
        `;
      case FlightCategory.VFR:
        return css`
          ${outputP3ColorFromRGB([0, 255, 0])}
          opacity: 0.8;
          border: 1px solid;
          ${outputP3ColorFromRGB([0, 255, 0], "border-color")}
        `;
    }
  }}
`;

interface AirportProps {
  taf: IForecastContainer;
  date: string;
}

export default function Airport({ taf, date }: AirportProps) {
  let composedForecast: ICompositeForecast | undefined = useMemo(() => {
    let result: ICompositeForecast | undefined;
    try {
      result = getCompositeForecastForDate(new Date(date), taf);
    } catch (e) {
      if (e instanceof TimestampOutOfBoundsError) return;
      throw e;
    }

    return result;
  }, [date, taf]);

  let clouds: ICloud[] = useMemo(() => {
    if (!composedForecast) return [];

    return [
      ...composedForecast.base.clouds,
      ...composedForecast.additional.flatMap(({ clouds }) => clouds),
    ].sort((a, b) => (a.height || 100000) - (b.height || 100000));
  }, [composedForecast]);

  if (!composedForecast) return <></>;

  const category = getFlightCategory(
    composedForecast.additional[0]?.visibility ||
      composedForecast.base.visibility,
    clouds
  );

  const lowestCloud: ICloud | undefined = clouds[0];
  const cloudLabel = lowestCloud
    ? lowestCloud.height
      ? `${lowestCloud.quantity}@${lowestCloud.height / 1000}k`
      : lowestCloud.quantity
    : "SKC";

  const badge = (
    <AirportContainer category={category}>{taf.station}</AirportContainer>
  );

  return <Micro icon={badge}>{cloudLabel}</Micro>;
}

function getFlightCategory(
  visibility: Visibility | undefined,
  clouds: ICloud[]
): FlightCategory {
  const distance = visibility?.value != null ? visibility?.value : Infinity;
  const height = determineCeilingFromClouds(clouds) || Infinity;

  let flightCategory = FlightCategory.VFR;

  if (height <= 3000 || distance <= 5) flightCategory = FlightCategory.MVFR;
  if (height <= 1000 || distance <= 3) flightCategory = FlightCategory.IFR;
  if (height <= 500 || distance <= 1) flightCategory = FlightCategory.LIFR;

  return flightCategory;
}

function determineCeilingFromClouds(clouds: ICloud[]): number | undefined {
  let ceiling: number | undefined;

  clouds.forEach((cloud) => {
    if (
      cloud.height != null &&
      (cloud.quantity === CloudQuantity.OVC ||
        cloud.quantity === CloudQuantity.BKN)
    ) {
      if (!ceiling || ceiling > cloud.height) ceiling = cloud.height;
    }
  });

  return ceiling;
}
