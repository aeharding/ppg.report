import React, { useMemo } from "react";
import { css, SerializedStyles } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import {
  CloudQuantity,
  CloudType,
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
import BottomSheet from "../../../bottomSheet/BottomSheet";
import DetailedAviationReport from "../aviation/DetailedAviationReport";
import { notEmpty } from "../../../helpers/array";
import { isTouchDevice } from "../../../helpers/device";

export enum FlightCategory {
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
  border: 1px solid;

  ${({ category }) => getFlightCategoryCssColor(category)}
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

  const verticalVisbility =
    composedForecast.additional[0]?.verticalVisibility ??
    composedForecast.base.verticalVisibility;

  const category = getFlightCategory(visibility, clouds);

  const lowestCloud: ICloud | undefined = clouds[0];
  const cloudLabel = lowestCloud
    ? lowestCloud.height
      ? `${lowestCloud.quantity}@${lowestCloud.height / 1000}k`
      : lowestCloud.quantity
    : verticalVisbility
    ? "OBSC"
    : "SKC";

  const badge = (
    <AirportContainer category={category}>{taf.station}</AirportContainer>
  );

  const tip = (
    <>
      <div>
        Forecasted to be {category} by TAF report from {taf.station}:
      </div>
      {buildTooltip(visibility, clouds, verticalVisbility)}
    </>
  );

  return (
    <BottomSheet
      openButton={
        <Tippy content={tip} placement="bottom" disabled={isTouchDevice()}>
          <div>
            <Micro icon={badge}>{cloudLabel}</Micro>
          </div>
        </Tippy>
      }
      title={`${taf.station} Aviation Weather Report`}
    >
      <DetailedAviationReport taf={taf} />
    </BottomSheet>
  );
}

function buildTooltip(
  visibility: Visibility | undefined,
  clouds: ICloud[],
  verticalVisibility: number | undefined
): React.ReactNode {
  return (
    <ul>
      {[
        formatVisibility(visibility),
        formatCeiling(clouds),
        formatVerticalVisbility(verticalVisibility),
      ]
        .filter(notEmpty)
        .map((str, index) => (
          <li key={index}>{str}.</li>
        ))}
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

  ret += formatCloud(ceiling);

  return ret;
}

function formatVerticalVisbility(
  verticalVisibility: number | undefined
): string | undefined {
  if (verticalVisibility == null) return;

  return `${verticalVisibility.toLocaleString()} ft AGL vertical visibility`;
}

export function formatCloud(cloud: ICloud): string {
  let ret = "";

  switch (cloud.quantity) {
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

  if (cloud.type) {
    ret += ` (${formatCloudType(cloud.type)})`;
  }

  ret += ` at ${cloud.height?.toLocaleString()}ft`;

  return ret;
}

function formatCloudType(type: CloudType): string {
  switch (type) {
    case CloudType.CB:
      return "Cumulonimbus";
    case CloudType.TCU:
      return "Towering cumulus";
    case CloudType.CI:
      return "Cirrus";
    case CloudType.CC:
      return "Cirrocumulus";
    case CloudType.CS:
      return "Cirrostratus";
    case CloudType.AC:
      return "Altocumulus";
    case CloudType.ST:
      return "Stratus";
    case CloudType.CU:
      return "Cumulus";
    case CloudType.AS:
      return "Astrostratus";
    case CloudType.NS:
      return "Nimbostratus";
    case CloudType.SC:
      return "Stratocumulus";
  }
}
export function getFlightCategory(
  visibility: Visibility | undefined,
  clouds: ICloud[],
  verticalVisibility?: number
): FlightCategory {
  const convertedVisibility = convertToMiles(visibility);
  const distance = convertedVisibility != null ? convertedVisibility : Infinity;
  const height =
    determineCeilingFromClouds(clouds)?.height ??
    verticalVisibility ??
    Infinity;

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
export function determineCeilingFromClouds(
  clouds: ICloud[]
): ICloud | undefined {
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

export function getFlightCategoryCssColor(
  category: FlightCategory
): SerializedStyles {
  switch (category) {
    case FlightCategory.LIFR:
      return css`
        ${outputP3ColorFromRGB([255, 0, 255])}
      `;
    case FlightCategory.IFR:
      return css`
        ${outputP3ColorFromRGB([255, 0, 0])}
      `;
    case FlightCategory.MVFR:
      return css`
        ${outputP3ColorFromRGB([0, 150, 255])}
      `;
    case FlightCategory.VFR:
      return css`
        ${outputP3ColorFromRGB([0, 255, 0])}
      `;
  }
}
