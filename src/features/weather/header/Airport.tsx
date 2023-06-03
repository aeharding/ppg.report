import React, { useMemo } from "react";
import styled from "@emotion/styled";
import {
  getCompositeForecastForDate,
  ICloud,
  ICompositeForecast,
  IForecastContainer,
  TimestampOutOfBoundsError,
  Visibility,
} from "metar-taf-parser";
import { Micro } from "../WeatherHeader";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import DetailedAviationReport from "../aviation/DetailedAviationReport";
import { notEmpty } from "../../../helpers/array";
import {
  convertHeightToMeters,
  FlightCategory,
  formatCeiling,
  formatVerticalVisbility,
  formatVisibility,
  getFlightCategory,
  getFlightCategoryCssColor,
} from "../../../helpers/taf";
import { useAppSelector } from "../../../hooks";
import { heightValueFormatter } from "../../rap/cells/Altitude";
import { useTranslation } from "react-i18next";
import {
  DistanceUnit,
  HeightUnit,
} from "../../rap/extra/settings/settingEnums";
import Tooltip from "../../../shared/Tooltip";

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

const StyledMicro = styled(Micro)`
  cursor: pointer;
`;

interface AirportProps {
  taf: IForecastContainer;
  date: string;
}

export default function Airport({ taf, date }: AirportProps) {
  const { t } = useTranslation();
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const distanceUnit = useAppSelector((state) => state.user.distanceUnit);

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
      ...composedForecast.prevailing.clouds,
      ...composedForecast.supplemental.flatMap(({ clouds }) => clouds),
    ].sort((a, b) => (a.height || 100000) - (b.height || 100000));
  }, [composedForecast]);

  if (!composedForecast) return <></>;

  const visibility = [
    ...composedForecast.supplemental.map(({ visibility }) => visibility),
    composedForecast.prevailing.visibility,
  ]
    .filter(notEmpty)
    .sort((a, b) => a.value - b.value)[0];

  const verticalVisbility =
    composedForecast.supplemental[0]?.verticalVisibility ??
    composedForecast.prevailing.verticalVisibility;

  const category = getFlightCategory(visibility, clouds);

  const lowestCloud: ICloud | undefined = clouds[0];
  const cloudLabel = lowestCloud
    ? lowestCloud.height
      ? `${lowestCloud.quantity}@${
          Math.round(
            (heightValueFormatter(
              convertHeightToMeters(lowestCloud.height),
              heightUnit
            ) /
              1_000) *
              10
          ) / 10
        }k`
      : lowestCloud.quantity
    : verticalVisbility
    ? "OBSC"
    : "SKC";

  const badge = (
    <AirportContainer category={category}>{taf.station}</AirportContainer>
  );

  function renderTip() {
    return (
      <>
        <div>
          {t("TAF forecast overview", {
            flightCategory: category,
            airportStationIdentifier: taf.station,
          })}
          :
        </div>
        {buildTooltip(
          visibility,
          clouds,
          verticalVisbility,
          heightUnit,
          distanceUnit
        )}
      </>
    );
  }

  return (
    <BottomSheet
      openButton={
        <Tooltip contents={renderTip} mouseOnly>
          <div>
            <StyledMicro icon={badge}>{cloudLabel}</StyledMicro>
          </div>
        </Tooltip>
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
  verticalVisibility: number | undefined,
  heightUnit: HeightUnit,
  distanceUnit: DistanceUnit
): React.ReactNode {
  return (
    <ul>
      {[
        formatVisibility(visibility, distanceUnit),
        formatCeiling(clouds, heightUnit),
        formatVerticalVisbility(verticalVisibility, heightUnit),
      ]
        .filter(notEmpty)
        .map((str, index) => (
          <li key={index}>{str}.</li>
        ))}
    </ul>
  );
}
