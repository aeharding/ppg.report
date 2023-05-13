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
import Tippy from "@tippyjs/react";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import DetailedAviationReport from "../aviation/DetailedAviationReport";
import { notEmpty } from "../../../helpers/array";
import { isTouchDevice } from "../../../helpers/device";
import {
  FlightCategory,
  formatCeiling,
  formatVerticalVisbility,
  formatVisibility,
  getFlightCategory,
  getFlightCategoryCssColor,
} from "../../../helpers/taf";

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
            <StyledMicro icon={badge}>{cloudLabel}</StyledMicro>
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
