import React, { useMemo } from "react";
import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import {
  CloudQuantity,
  DistanceUnit,
  getCompositeForecastForDate,
  ICloud,
  ICompositeForecast,
  IForecastContainer,
  TimestampOutOfBoundsError,
  ValueIndicator,
  Visibility,
} from "metar-taf-parser";
import { Micro } from "../WeatherHeader";
import Tippy from "@tippyjs/react";

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

  const visibility =
    composedForecast.additional[0]?.visibility ||
    composedForecast.base.visibility;

  const category = getFlightCategory(visibility, clouds);

  const lowestCloud: ICloud | undefined = clouds[0];
  const cloudLabel = lowestCloud
    ? lowestCloud.height
      ? `${lowestCloud.quantity}@${lowestCloud.height / 1000}k`
      : lowestCloud.quantity
    : "SKC";

  const badge = (
    <AirportContainer category={category}>{taf.station}</AirportContainer>
  );

  const tip = (
    <>
      <div>
        Forecasted to be {category} by TAF report from {taf.station}:
      </div>
      {buildTooltip(visibility, clouds)}
    </>
  );

  return (
    <Tippy content={tip} placement="bottom">
      <div>
        <Micro icon={badge}>{cloudLabel}</Micro>
      </div>
    </Tippy>
  );
}

function buildTooltip(
  visibility: Visibility | undefined,
  clouds: ICloud[]
): React.ReactNode {
  return (
    <ul>
      {[formatVisibility(visibility), formatCeiling(clouds)].map(
        (str, index) => (
          <li key={index}>{str}.</li>
        )
      )}
    </ul>
  );
}

function formatVisibility(visibility: Visibility | undefined): string {
  if (!visibility) return "Unknown visibility";

  let value = "";

  if (visibility.unit === DistanceUnit.StatuteMiles)
    value = `${visibility.value} statute miles`;
  if (visibility.unit === DistanceUnit.Meters)
    value = `${+(visibility.value / 1000).toFixed(2)} km`;

  if (visibility.indicator === ValueIndicator.GreaterThan)
    value = `Greater than ${value}`;
  else if (visibility.indicator === ValueIndicator.LessThan)
    value = `Less than ${value}`;

  return `${value} visibility`;
}

function formatCeiling(clouds: ICloud[]): string {
  const ceiling = determineCeilingOrLowestLayerFromClouds(clouds);

  let ret = "";

  if (!ceiling) return "No clouds found";

  switch (ceiling.quantity) {
    case CloudQuantity.NSC:
      return "No significant clouds";
    case CloudQuantity.SKC:
      return "Clear sky";
    case CloudQuantity.BKN:
      ret += "Broken clouds";
      break;
    case CloudQuantity.FEW:
      ret += "Few clouds";
      break;
    case CloudQuantity.SCT:
      ret += "Scattered clouds";
      break;
    case CloudQuantity.OVC:
      ret += "Overcast";
  }

  ret += ` at ${ceiling.height?.toLocaleString()}ft`;

  return ret;
}

function getFlightCategory(
  visibility: Visibility | undefined,
  clouds: ICloud[]
): FlightCategory {
  const convertedVisibility = convertToMiles(visibility);
  const distance = convertedVisibility != null ? convertedVisibility : Infinity;
  const height = determineCeilingFromClouds(clouds)?.height || Infinity;

  let flightCategory = FlightCategory.VFR;

  if (height <= 3000 || distance <= 5) flightCategory = FlightCategory.MVFR;
  if (height <= 1000 || distance <= 3) flightCategory = FlightCategory.IFR;
  if (height <= 500 || distance <= 1) flightCategory = FlightCategory.LIFR;

  return flightCategory;
}

/**
 * Finds the ceiling. If no ceiling exists, returns the lowest cloud layer.
 */
function determineCeilingOrLowestLayerFromClouds(
  clouds: ICloud[]
): ICloud | undefined {
  let ceiling: ICloud | undefined;

  clouds.forEach((cloud) => {
    if (
      !ceiling ||
      (cloud.height != null &&
        (cloud.quantity === CloudQuantity.OVC ||
          cloud.quantity === CloudQuantity.BKN))
    ) {
      if (
        !ceiling ||
        ceiling.height == null ||
        cloud.height == null ||
        ceiling.height > cloud.height
      )
        ceiling = cloud;
    }
  });

  return ceiling;
}

/**
 * Finds the ceiling. If no ceiling exists, returns the lowest cloud layer.
 */
function determineCeilingFromClouds(clouds: ICloud[]): ICloud | undefined {
  let ceiling: ICloud | undefined;

  clouds.forEach((cloud) => {
    if (
      cloud.height != null &&
      cloud.height < (ceiling?.height || Infinity) &&
      (cloud.quantity === CloudQuantity.OVC ||
        cloud.quantity === CloudQuantity.BKN)
    )
      ceiling = cloud;
  });

  return ceiling;
}

function convertToMiles(visibility?: Visibility): number | undefined {
  if (!visibility) return;

  switch (visibility.unit) {
    case DistanceUnit.StatuteMiles:
      return visibility.value;
    case DistanceUnit.Meters:
      const distance = visibility.value * 0.000621371;

      if (visibility.value % 1000 === 0 || visibility.value === 9999)
        return Math.round(distance);

      return +distance.toFixed(2);
  }
}
