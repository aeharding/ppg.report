import styled from "@emotion/styled/macro";
import { startOfTomorrow } from "date-fns";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import {
  Descriptive,
  Forecast as IForecast,
  Intensity,
  IWeatherCondition,
  Phenomenon,
  ValueIndicator,
  WeatherChangeType,
} from "metar-taf-parser";
import React from "react";
import { notEmpty } from "../../../helpers/array";
import { useAppSelector } from "../../../hooks";
import WindIndicator from "../../rap/WindIndicator";
import {
  determineCeilingFromClouds,
  FlightCategory,
  getFlightCategory,
  getFlightCategoryCssColor,
} from "../header/Airport";
import { timeZoneSelector } from "../weatherSlice";
import Cloud from "./Cloud";

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  border-left: 3px solid #0095ff;
  background: #0095ff10;
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

  if (!timeZone) throw new Error("timezone undefined");

  const ceiling = determineCeilingFromClouds(data.clouds);
  const category = getFlightCategory(
    data.visibility,
    data.clouds,
    data.verticalVisibility
  );
  const periodRemark = getPeriodRemark(data, timeZone);

  function formatType(type: WeatherChangeType | undefined): string {
    switch (type) {
      case WeatherChangeType.FM:
      case undefined:
        return "From";
      case WeatherChangeType.BECMG:
        return "Becoming";
      case WeatherChangeType.PROB:
        return `${data.probability}% Probability`;
      case WeatherChangeType.TEMPO:
        return "Temporarily between";
    }
  }

  return (
    <Container>
      <Header>
        <Text>
          {formatType(data.type)}{" "}
          {formatWithTomorrowIfNeeded(data.start, timeZone, "p")}{" "}
          {data.end ? (
            <>to {formatWithTomorrowIfNeeded(data.end, timeZone, "p")}</>
          ) : (
            ""
          )}
        </Text>

        {data.visibility &&
        (data.clouds.length || data.verticalVisibility != null) ? (
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
                {data.wind.speed && data.wind.direction ? (
                  <>
                    {data.wind.degrees != null ? (
                      <>
                        {data.wind.degrees}{" "}
                        <WindIndicator direction={data.wind.degrees} />
                      </>
                    ) : (
                      "Variable"
                    )}{" "}
                    at {data.wind.speed} {data.wind.unit}{" "}
                  </>
                ) : (
                  <>Calm</>
                )}{" "}
                {data.wind.gust != null && (
                  <>
                    <br />
                    Gusting to {data.wind.gust} {data.wind.unit}
                  </>
                )}
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
                {data.visibility.value} {data.visibility.unit}{" "}
                {data.visibility.ndv && "NDV"}{" "}
                {formatIndicator(data.visibility.indicator)}
              </td>
            </tr>
          )}

          {data.visibility &&
          (data.clouds.length || data.verticalVisibility != null) ? (
            <tr>
              <td>Ceiling</td>
              <td>
                {ceiling
                  ? `${ceiling.height?.toLocaleString()} ft AGL`
                  : data.verticalVisibility
                  ? `Vertical visibility ${data.verticalVisibility.toFixed()} ft AGL`
                  : "At least 12,000 ft AGL"}
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
        </tbody>
      </Table>
      <Raw>{data.raw}</Raw>
    </Container>
  );
}

function formatIndicator(indicator: ValueIndicator | undefined) {
  switch (indicator) {
    case ValueIndicator.GreaterThan:
      return "or greater";
    case ValueIndicator.LessThan:
      return "or less";
    default:
      return "";
  }
}

function formatWeather(weather: IWeatherCondition[]): React.ReactNode {
  return (
    <>
      {weather
        .map((condition) =>
          [
            formatIntensity(condition.intensity),
            formatDescriptive(condition.descriptive),
            condition.phenomenons
              .map((phenomenon) => formatPhenomenon(phenomenon))
              .join("/"),
          ]
            .filter(notEmpty)
            .join(" ")
        )
        .join(", ")}
    </>
  );
}

function formatPhenomenon(phenomenon: Phenomenon): string {
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
  }
}

function formatDescriptive(descriptive: Descriptive | undefined): string {
  switch (descriptive) {
    case Descriptive.SHOWERS:
      return "Showers of";
    case Descriptive.SHALLOW:
      return "Shallow";
    case Descriptive.PATCHES:
      return "Patches of";
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

function formatIntensity(intensity: Intensity | undefined): string {
  switch (intensity) {
    case Intensity.HEAVY:
      return "Heavy";
    case Intensity.IN_VICINITY:
      return "In vicinity";
    case Intensity.LIGHT:
      return "Light";
    default:
      return "";
  }
}

function getPeriodRemark(
  forecast: IForecast,
  timeZone: string
): string | undefined {
  switch (forecast.type) {
    case WeatherChangeType.BECMG:
      if (forecast.validity.end)
        return `Conditions expected to become as follows by ${formatWithTomorrowIfNeeded(
          forecast.validity.end,
          timeZone,
          "p"
        )}.`;
      break;
    case WeatherChangeType.TEMPO:
      return "The following changes expected for less than half the time period.";
  }
}

function formatWithTomorrowIfNeeded(
  date: Date,
  timeZone: string,
  formatStr: string
): string {
  return `${formatInTimeZone(date, timeZone, formatStr)}${
    new Date(date).getTime() >=
    zonedTimeToUtc(startOfTomorrow(), timeZone).getTime()
      ? " tomorrow"
      : ""
  }`;
}
