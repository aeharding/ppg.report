import {
  Descriptive,
  Intensity,
  Phenomenon,
  SpeedUnit as MetarTafSpeedUnit,
  CloudQuantity,
  CloudType,
  DistanceUnit as MetarTafDistanceUnit,
  ValueIndicator,
  Visibility,
  ICloud,
  TurbulenceIntensity,
  IcingIntensity,
} from "metar-taf-parser";
import { css, SerializedStyles } from "@emotion/react";
import { outputP3ColorFromRGB } from "./colors";
import {
  DistanceUnit,
  HeightUnit,
  SpeedUnit,
} from "../features/user/userSlice";
import {
  heightUnitFormatter,
  heightValueFormatter,
} from "../features/rap/cells/Altitude";
import { speedUnitFormatter } from "../features/rap/cells/WindSpeed";

export enum FlightCategory {
  VFR = "VFR",
  MVFR = "MVFR",
  IFR = "IFR",
  LIFR = "LIFR",
}

export function formatIndicator(indicator: ValueIndicator | undefined) {
  switch (indicator) {
    case ValueIndicator.GreaterThan:
      return "or greater";
    case ValueIndicator.LessThan:
      return "or less";
    default:
      return "";
  }
}

export function formatPhenomenon(phenomenon: Phenomenon): string {
  switch (phenomenon) {
    case Phenomenon.RAIN:
      return "Rain";
    case Phenomenon.DRIZZLE:
      return "Drizzle";
    case Phenomenon.SNOW:
      return "Snow";
    case Phenomenon.SNOW_GRAINS:
      return "Snow grains";
    case Phenomenon.ICE_PELLETS:
      return "Ice pellets";
    case Phenomenon.ICE_CRYSTALS:
      return "Ice crystals";
    case Phenomenon.HAIL:
      return "Hail";
    case Phenomenon.SMALL_HAIL:
      return "Small hail";
    case Phenomenon.UNKNOW_PRECIPITATION:
      return "Unknown precipitation";
    case Phenomenon.FOG:
      return "Fog";
    case Phenomenon.VOLCANIC_ASH:
      return "Volcanic ash";
    case Phenomenon.MIST:
      return "Mist";
    case Phenomenon.HAZE:
      return "Haze";
    case Phenomenon.WIDESPREAD_DUST:
      return "Widespread dust";
    case Phenomenon.SMOKE:
      return "Smoke";
    case Phenomenon.SAND:
      return "Sand";
    case Phenomenon.SPRAY:
      return "Spray";
    case Phenomenon.SQUALL:
      return "Squall";
    case Phenomenon.SAND_WHIRLS:
      return "Sand whirls";
    case Phenomenon.THUNDERSTORM:
      return "Thunderstorm";
    case Phenomenon.DUSTSTORM:
      return "Duststorm";
    case Phenomenon.SANDSTORM:
      return "Sandstorm";
    case Phenomenon.FUNNEL_CLOUD:
      return "Funnel cloud";
    case Phenomenon.NO_SIGNIFICANT_WEATHER:
      return "No significant weather";
  }
}

export function formatDescriptive(
  descriptive: Descriptive | undefined,
  hasPhenomenon: boolean
): string {
  switch (descriptive) {
    case Descriptive.SHOWERS:
      return `Showers${hasPhenomenon ? " of" : ""}`;
    case Descriptive.SHALLOW:
      return "Shallow";
    case Descriptive.PATCHES:
      return `Patches${hasPhenomenon ? " of" : ""}`;
    case Descriptive.PARTIAL:
      return "Partial";
    case Descriptive.DRIFTING:
      return "Drifting";
    case Descriptive.THUNDERSTORM:
      return "Thunderstorm";
    case Descriptive.BLOWING:
      return "Blowing";
    case Descriptive.FREEZING:
      return "Freezing";
    default:
      return "";
  }
}

export function formatIntensity(intensity: Intensity | undefined): string {
  switch (intensity) {
    case Intensity.HEAVY:
      return "Heavy";
    case Intensity.IN_VICINITY:
      return "in vicinity";
    case Intensity.LIGHT:
      return "Light";
    default:
      return "";
  }
}

export function convertSpeedToKph(
  speed: number,
  unit: MetarTafSpeedUnit
): number {
  switch (unit) {
    case MetarTafSpeedUnit.KilometersPerHour:
      return speed;
    case MetarTafSpeedUnit.Knot:
      return speed * 1.852;
    case MetarTafSpeedUnit.MetersPerSecond:
      return speed * 3.6;
  }
}

function convertKphToUserSpeed(
  speedInKph: number,
  speedUnit: SpeedUnit
): number {
  switch (speedUnit) {
    case SpeedUnit.KPH:
      return speedInKph;
    case SpeedUnit.Knots:
      return speedInKph * 0.539957;
    case SpeedUnit.MPH:
      return speedInKph * 0.621371;
    case SpeedUnit.mps:
      return speedInKph * 0.277778;
  }
}

export function formatWind(
  speed: number,
  unit: MetarTafSpeedUnit,
  speedUnit: SpeedUnit,
  withUnits = true
) {
  const speedInKph = convertSpeedToKph(speed, unit);
  const convertedSpeed = convertKphToUserSpeed(speedInKph, speedUnit);

  return [
    Math.round(convertedSpeed).toLocaleString(),
    withUnits ? speedUnitFormatter(speedUnit) : undefined,
  ]
    .filter((a) => a)
    .join(" ");
}

export function formatVisibility(
  visibility: Visibility | undefined,
  distanceUnit: DistanceUnit
): string {
  if (!visibility) return "Unknown visibility";

  let value = formatDistance(visibility.value, visibility.unit, distanceUnit);

  const indiciator = formatIndicator(visibility.indicator);

  if (indiciator) value = `${value} ${indiciator}`;

  return value;
}

function convertDistanceToMiles(
  distance: number,
  unit: MetarTafDistanceUnit
): number {
  switch (unit) {
    case MetarTafDistanceUnit.Meters:
      if (distance === 9999) return 6;
      return distance / 1609.34;
    case MetarTafDistanceUnit.StatuteMiles:
      return distance;
  }
}

function convertMilesToUserDistance(
  distanceInMiles: number,
  distanceUnit: DistanceUnit
): number {
  switch (distanceUnit) {
    case DistanceUnit.Kilometers: {
      if (distanceInMiles === 6) return 10;
      return distanceInMiles * 1.60934;
    }
    case DistanceUnit.Miles:
      return distanceInMiles;
  }
}

export function formatDistance(
  distance: number,
  unit: MetarTafDistanceUnit,
  distanceUnit: DistanceUnit
): string {
  const distanceAsMiles = convertDistanceToMiles(distance, unit);
  const distanceAsUserDistance = convertMilesToUserDistance(
    distanceAsMiles,
    distanceUnit
  );

  return `${(
    Math.round(distanceAsUserDistance * 10) / 10
  ).toLocaleString()} ${formatDistanceUnit(distanceUnit)}`;
}

function formatDistanceUnit(distanceUnit: DistanceUnit, plural = true): string {
  switch (distanceUnit) {
    case DistanceUnit.Kilometers:
      return "km";
    case DistanceUnit.Miles:
      return `mile${plural ? "s" : ""}`;
  }
}

export function convertHeightToMeters(heightInFeet: number): number {
  return heightInFeet * 0.3048;
}

export function formatCeiling(
  clouds: ICloud[],
  heightUnit: HeightUnit
): string {
  const ceiling = determineCeilingOrLowestLayerFromClouds(clouds);

  let ret = "";

  if (!ceiling) return "No clouds found";

  ret += formatCloud(ceiling, heightUnit);

  return ret;
}

export function formatVerticalVisbility(
  verticalVisibility: number | undefined,
  heightUnit: HeightUnit
): string | undefined {
  if (verticalVisibility == null) return;

  return `${formatHeight(
    verticalVisibility,
    heightUnit
  )} AGL vertical visibility`;
}

export function formatCloud(cloud: ICloud, heightUnit: HeightUnit): string {
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

  if (cloud.height) ret += ` at ${formatHeight(cloud.height!, heightUnit)}`;

  return ret;
}

export function formatHeight(
  heightInFeet: number,
  heightUnit: HeightUnit
): string {
  return `${(
    Math.round(
      heightValueFormatter(convertHeightToMeters(heightInFeet), heightUnit) /
        100
    ) * 100
  ).toLocaleString()}${heightUnitFormatter(heightUnit)}`;
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
    case MetarTafDistanceUnit.StatuteMiles:
      return visibility.value;
    case MetarTafDistanceUnit.Meters:
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

export function formatTurbulenceIntensity(
  turbulenceIntensity: TurbulenceIntensity
): string {
  switch (turbulenceIntensity) {
    case TurbulenceIntensity.None:
      return "None";
    case TurbulenceIntensity.Light:
      return "Light turbulence";
    case TurbulenceIntensity.ModerateClearAirOccasional:
      return "Moderate turbulence in clear air, occasional";
    case TurbulenceIntensity.ModerateClearAirFrequent:
      return "Moderate turbulence in clear air, frequent";
    case TurbulenceIntensity.ModerateCloudOccasional:
      return "Moderate turbulence in cloud, occasional";
    case TurbulenceIntensity.ModerateCloudFrequent:
      return "Moderate turbulence in cloud, frequent";
    case TurbulenceIntensity.SevereClearAirOccasional:
      return "Severe turbulence in clear air, occasional";
    case TurbulenceIntensity.SevereClearAirFrequent:
      return "Severe turbulence in clear air, frequent";
    case TurbulenceIntensity.SevereCloudOccasional:
      return "Severe turbulence in cloud, occasional";
    case TurbulenceIntensity.SevereCloudFrequent:
      return "Severe turbulence in cloud, frequent";
    case TurbulenceIntensity.Extreme:
      return "Extreme turbulence";
  }
}

export function formatIcingIntensity(icingIntensity: IcingIntensity): string {
  switch (icingIntensity) {
    case IcingIntensity.None:
      return "Trace, or no icing";
    case IcingIntensity.Light:
      return "Light mixed icing";
    case IcingIntensity.LightRimeIcingCloud:
      return "Light rime icing in cloud";
    case IcingIntensity.LightClearIcingPrecipitation:
      return "Light clear icing in precipitation";
    case IcingIntensity.ModerateMixedIcing:
      return "Moderate mixed icing";
    case IcingIntensity.ModerateRimeIcingCloud:
      return "Moderate rime icing in cloud";
    case IcingIntensity.ModerateClearIcingPrecipitation:
      return "Moderate clear icing in precipitation";
    case IcingIntensity.SevereMixedIcing:
      return "Severe mixed icing";
    case IcingIntensity.SevereRimeIcingCloud:
      return "Severe rime icing in cloud";
    case IcingIntensity.SevereClearIcingPrecipitation:
      return "Severe clear icing in precipitation";
  }
}
