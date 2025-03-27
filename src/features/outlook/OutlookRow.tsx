import { timeZoneSelector } from "../weather/weatherSlice";
import { useAppSelector } from "../../hooks";
import styled from "@emotion/styled";
import WindIndicator from "../rap/WindIndicator";
import WindSpeed from "./WindSpeed";
import {
  faCloudMoon,
  faClouds,
  faCloudsMoon,
  faCloudsSun,
  faCloudSun,
  faMoon,
  faSun,
} from "@fortawesome/pro-duotone-svg-icons";
import SunCalc from "suncalc";
import { TemperatureText } from "../rap/cells/Temperature";
import { Aside } from "../rap/cells/Altitude";
import {
  TemperatureUnit,
  TimeFormat,
} from "../rap/extra/settings/settingEnums";
import { cToF } from "../weather/aviation/DetailedAviationReport";
import { Observations } from "../weather/header/Weather";
import { NWSWeatherObservation } from "../../services/nwsWeather";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

const Row = styled.tr<{ day: boolean }>`
  display: flex;

  > * {
    flex: 1;
  }

  border-bottom: 1px solid #77777715;

  background: ${({ day }) => (day ? "#ffffff07" : "transparent")};
`;

const TimeCell = styled.td`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledObservations = styled(Observations)`
  font-size: 1em;
  margin-right: 0;
`;

interface OutlookRowProps {
  hour: Date;
  windDirection: number;
  windSpeed: number;
  windGust: number;
  temperature: number;
  observations: NWSWeatherObservation[] | number;
  skyCover: number;
}

export default function OutlookRow({
  hour,
  windDirection,
  windSpeed,
  windGust,
  temperature: inCelsius,
  observations,
  skyCover,
}: OutlookRowProps) {
  const timeFormat = useAppSelector((state) => state.user.timeFormat);

  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone needed");

  const coordinates = useAppSelector((state) => state.weather.coordinates);
  if (!coordinates) throw new Error("coordinates not found");

  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const time = format(new TZDate(hour, timeZone), timeFormatString(timeFormat));

  const isDay =
    SunCalc.getPosition(hour, coordinates.lat, coordinates.lon).altitude > 0;

  const temperatureUnitLabel = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "C";
      case TemperatureUnit.Fahrenheit:
        return "F";
    }
  })();

  const temperature = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return inCelsius;
      case TemperatureUnit.Fahrenheit:
        return cToF(inCelsius);
    }
  })();

  return (
    <Row day={isDay}>
      <TimeCell>{time}</TimeCell>
      <td
        style={{
          maxWidth: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StyledObservations
          data={observations}
          defaultIcon={getDefaultIcon(skyCover, isDay)}
        />
      </td>
      <td>
        <TemperatureText temperature={inCelsius}>
          {Math.round(temperature)} <Aside>°{temperatureUnitLabel}</Aside>{" "}
        </TemperatureText>
      </td>
      <td style={{ maxWidth: "3%" }} />
      <td style={{ textAlign: "start" }}>
        <WindSpeed speed={windSpeed} gust={windGust} />
      </td>
      <td style={{ textAlign: "start", maxWidth: "16%" }}>
        <WindIndicator direction={windDirection} />
      </td>
    </Row>
  );
}

function timeFormatString(timeFormat: TimeFormat): string {
  switch (timeFormat) {
    case TimeFormat.Twelve:
      return "hha";
    case TimeFormat.TwentyFour:
      return "HHmm";
  }
}

function getDefaultIcon(skyCover: number, isDay: boolean): IconProp {
  switch (true) {
    case skyCover < 20:
      return isDay ? faSun : faMoon;
    case skyCover < 60:
      return isDay ? faCloudSun : faCloudMoon;
    case skyCover < 80:
      return isDay ? faCloudsSun : faCloudsMoon;
    default:
      return faClouds;
  }
}
