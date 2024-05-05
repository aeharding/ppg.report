import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { startOfTomorrow } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  Forecast as IForecast,
  Intensity,
  IWeatherCondition,
  WeatherChangeType,
} from "metar-taf-parser";
import React from "react";
import { notEmpty } from "../../../helpers/array";
import { capitalizeFirstLetter } from "../../../helpers/string";
import {
  determineCeilingFromClouds,
  FlightCategory,
  formatDescriptive,
  formatHeight,
  formatIcingIntensity,
  formatIntensity,
  formatPhenomenon,
  formatTurbulenceIntensity,
  formatVisibility,
  getFlightCategory,
  getFlightCategoryCssColor,
} from "../../../helpers/taf";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../weatherSlice";
import Cloud from "./Cloud";
import Wind from "./cells/Wind";
import WindShear from "./cells/WindShear";
import { TimeFormat } from "../../rap/extra/settings/settingEnums";

const Container = styled.div<{ type: WeatherChangeType | undefined }>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  background: #0095ff10;
  border-left: 3px solid;

  ${({ type }) => {
    switch (type) {
      case undefined:
      case WeatherChangeType.FM:
      case WeatherChangeType.BECMG:
      default:
        return css`
          border-left-color: #0095ff;
        `;
      case WeatherChangeType.PROB:
      case WeatherChangeType.TEMPO:
        return css`
          border-left-color: #0095ff5d;
        `;
    }
  }}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: -0.25rem;
`;

const Text = styled.p`
  margin: 0;
`;

const Category = styled.div<{ category: FlightCategory }>`
  display: inline-block;
  padding: 2px 8px;

  border: 1px solid;
  border-radius: 1rem;

  ${({ category }) => getFlightCategoryCssColor(category)}
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;

  td {
    vertical-align: top;

    &:nth-of-type(1) {
      text-align: right;
      width: 35%;
      padding-right: 2rem;
      opacity: 0.7;
    }
  }
`;

const Raw = styled.div`
  padding: 0.5rem;

  background: rgba(0, 0, 0, 0.5);
  font-family: monospace;
`;

interface ForecastProps {
  data: IForecast;
}

export default function Forecast({ data }: ForecastProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const distanceUnit = useAppSelector((state) => state.user.distanceUnit);
  const timeFormat = useAppSelector((state) => state.user.timeFormat);

  if (!timeZone) throw new Error("timezone undefined");

  const ceiling = determineCeilingFromClouds(data.clouds);
  const category = getFlightCategory(
    data.visibility,
    data.clouds,
    data.verticalVisibility,
  );
  const periodRemark = getPeriodRemark(data, timeZone, timeFormat);

  function formatType(type: WeatherChangeType | undefined): string {
    switch (type) {
      case WeatherChangeType.FM:
      case undefined:
        return "From";
      case WeatherChangeType.BECMG:
        return "Becoming";
      case WeatherChangeType.PROB:
        return `${data.probability}% Chance`;
      case WeatherChangeType.TEMPO:
        return "Temporarily";
      case WeatherChangeType.INTER:
        return "Intermittent";
    }
  }

  return (
    <Container type={data.type}>
      <Header>
        <Text>
          {formatType(data.type)}{" "}
          {data.probability && data.type !== WeatherChangeType.PROB
            ? `(${data.probability}% chance) `
            : undefined}{" "}
          {formatWithTomorrowIfNeeded(
            data.start,
            timeZone,
            getTimeFormatString(timeFormat),
          )}{" "}
          {data.end ? (
            <>
              to{" "}
              {formatWithTomorrowIfNeeded(
                data.end,
                timeZone,
                getTimeFormatString(timeFormat),
              )}
            </>
          ) : (
            ""
          )}
        </Text>

        {data.visibility ? (
          <Category category={category}>{category}</Category>
        ) : (
          ""
        )}
      </Header>

      <Table>
        <tbody>
          {periodRemark && (
            <tr>
              <td>Period</td>
              <td>{periodRemark}</td>
            </tr>
          )}
          {data.wind && (
            <tr>
              <td>Wind</td>
              <td>
                <Wind wind={data.wind} />
              </td>
            </tr>
          )}
          {data.windShear && (
            <tr>
              <td>Wind Shear</td>
              <td>
                <WindShear windShear={data.windShear} />
              </td>
            </tr>
          )}
          {data.clouds.length || data.verticalVisibility != null ? (
            <tr>
              <td>Clouds</td>
              <td>
                {data.clouds.map((cloud, index) => (
                  <React.Fragment key={index}>
                    <Cloud data={cloud} />
                    <br />
                  </React.Fragment>
                ))}
                {data.verticalVisibility != null ? (
                  <>Obscured sky</>
                ) : undefined}
              </td>
            </tr>
          ) : (
            ""
          )}
          {data.visibility && (
            <tr>
              <td>Visibility</td>
              <td>
                {formatVisibility(data.visibility, distanceUnit)}{" "}
                {data.visibility.ndv && "No directional visibility"}{" "}
              </td>
            </tr>
          )}

          {data.visibility &&
          (data.clouds.length || data.verticalVisibility != null) ? (
            <tr>
              <td>Ceiling</td>
              <td>
                {ceiling?.height != null
                  ? `${formatHeight(ceiling.height, heightUnit)} AGL`
                  : data.verticalVisibility
                    ? `Vertical visibility ${formatHeight(
                        data.verticalVisibility,
                        heightUnit,
                      )} AGL`
                    : `At least ${formatHeight(12_000, heightUnit)} AGL`}
              </td>
            </tr>
          ) : (
            ""
          )}

          {data.weatherConditions.length ? (
            <tr>
              <td>Weather</td>
              <td>{formatWeather(data.weatherConditions)}</td>
            </tr>
          ) : undefined}

          {data.turbulence ? (
            <tr>
              <td>Turbulence</td>
              <td>
                {data.turbulence.map((turbulence) => (
                  <>
                    {formatTurbulenceIntensity(turbulence.intensity)} from{" "}
                    {turbulence.baseHeight
                      ? formatHeight(turbulence.baseHeight, heightUnit)
                      : "surface"}{" "}
                    to{" "}
                    {formatHeight(
                      turbulence.baseHeight + turbulence.depth,
                      heightUnit,
                    )}{" "}
                    AGL.
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}

          {data.icing ? (
            <tr>
              <td>Icing</td>
              <td>
                {data.icing.map((icing) => (
                  <>
                    {formatIcingIntensity(icing.intensity)} from{" "}
                    {icing.baseHeight
                      ? formatHeight(icing.baseHeight, heightUnit)
                      : "surface"}{" "}
                    to{" "}
                    {formatHeight(icing.baseHeight + icing.depth, heightUnit)}{" "}
                    AGL.
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}

          {data.remarks.length ? (
            <tr>
              <td>Remarks</td>
              <td>
                {data.remarks.map((remark) => (
                  <>
                    {remark.description || remark.raw}
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}
        </tbody>
      </Table>
      <Raw>{data.raw}</Raw>
    </Container>
  );
}

function formatWeather(weather: IWeatherCondition[]): React.ReactNode {
  return (
    <>
      {capitalizeFirstLetter(
        weather
          .map((condition) =>
            [
              condition.intensity !== Intensity.IN_VICINITY
                ? formatIntensity(condition.intensity)
                : undefined,
              formatDescriptive(
                condition.descriptive,
                !!condition.phenomenons.length,
              ),
              condition.phenomenons
                .map((phenomenon) => formatPhenomenon(phenomenon))
                .join("/"),
              condition.intensity === Intensity.IN_VICINITY
                ? formatIntensity(condition.intensity)
                : undefined,
            ]
              .filter(notEmpty)
              .join(" "),
          )
          .join(", ")
          .toLowerCase()
          .trim(),
      )}
    </>
  );
}

function getPeriodRemark(
  forecast: IForecast,
  timeZone: string,
  timeFormat: TimeFormat,
): string | undefined {
  switch (forecast.type) {
    case WeatherChangeType.BECMG:
      return `Conditions expected to become as follows by ${formatWithTomorrowIfNeeded(
        forecast.by,
        timeZone,
        getTimeFormatString(timeFormat),
      )}.`;
    case WeatherChangeType.TEMPO:
      return "The following changes expected for less than half the time period.";
  }
}

export function formatWithTomorrowIfNeeded(
  date: Date,
  timeZone: string,
  formatStr: string,
): string {
  return `${formatInTimeZone(date, timeZone, formatStr)}${
    new Date(date).getTime() >=
    fromZonedTime(startOfTomorrow(), timeZone).getTime()
      ? " tomorrow"
      : ""
  }`;
}

export function getTimeFormatString(
  timeFormat: TimeFormat,
  condensed = false,
): string {
  switch (timeFormat) {
    case TimeFormat.Twelve:
      return condensed ? "h:mmaaaaa" : "p";
    case TimeFormat.TwentyFour:
      return "HH:mm";
  }
}
