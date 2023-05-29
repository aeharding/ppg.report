import { IMetarDated, RemarkType } from "metar-taf-parser";
import {
  Category,
  Container,
  Header,
  Raw,
  Table,
  formatWeather,
} from "./Forecast";
import { formatVisibility, getFlightCategory } from "../../../helpers/taf";
import Wind from "./cells/Wind";
import WindShear from "./cells/WindShear";
import { useAppSelector } from "../../../hooks";
import { Forecasts } from "./DetailedAviationReport";
import Temperature from "./cells/Temperature";
import Pressure from "./cells/Pressure";
import RelativeTime from "../../../shared/RelativeTime";
import Remarks from "./cells/Remarks";
import Clouds from "./cells/Clouds";
import Ceiling from "./cells/Ceiling";
import Humidity from "./cells/Humidity";

interface MetarDetailProps {
  metar: IMetarDated;
}

export default function MetarDetail({ metar }: MetarDetailProps) {
  const distanceUnit = useAppSelector((state) => state.user.distanceUnit);
  const aviationWeather = useAppSelector(
    (state) => state.weather.aviationWeather
  );

  if (
    !aviationWeather ||
    aviationWeather === "failed" ||
    aviationWeather === "not-available" ||
    aviationWeather === "pending" ||
    !aviationWeather.metar
  )
    return <></>;

  const category = getFlightCategory(
    metar.visibility,
    metar.clouds,
    metar.verticalVisibility
  );

  const highPrecisionTemperatureDewPoint = (() => {
    for (const remark of metar.remarks) {
      if (remark.type === RemarkType.HourlyTemperatureDewPoint) return remark;
    }
  })();
  const temperature =
    highPrecisionTemperatureDewPoint?.temperature ?? metar.temperature;
  const dewPoint = highPrecisionTemperatureDewPoint?.dewPoint ?? metar.dewPoint;

  return (
    <Forecasts>
      <Container type="METAR">
        <Header>
          <span>
            Observed conditions <RelativeTime date={metar.issued} />
          </span>
          <Category category={category}>{category}</Category>
        </Header>

        <Table>
          <tbody>
            {temperature != null && (
              <tr>
                <td>Temperature</td>
                <td>
                  <Temperature temperatureInC={temperature} />
                </td>
              </tr>
            )}
            {dewPoint != null && (
              <tr>
                <td>Dew Point</td>
                <td>
                  <Temperature temperatureInC={dewPoint} />{" "}
                  {temperature != null ? (
                    <>
                      {" "}
                      [{" "}
                      <Humidity
                        temperature={temperature}
                        dewPoint={dewPoint}
                      />{" "}
                      ]
                    </>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            )}
            {metar.altimeter && (
              <tr>
                <td>Pressure</td>
                <td>
                  <Pressure altimeter={metar.altimeter} />
                </td>
              </tr>
            )}
            {metar.wind && (
              <tr>
                <td>Wind</td>
                <td>
                  <Wind wind={metar.wind} />
                </td>
              </tr>
            )}
            {metar.windShear && (
              <tr>
                <td>Wind Shear</td>
                <td>
                  <WindShear windShear={metar.windShear} />
                </td>
              </tr>
            )}
            {metar.clouds.length || metar.verticalVisibility != null ? (
              <tr>
                <td>Clouds</td>
                <td>
                  <Clouds
                    clouds={metar.clouds}
                    verticalVisibility={metar.verticalVisibility}
                  />
                </td>
              </tr>
            ) : (
              ""
            )}
            {metar.visibility && (
              <tr>
                <td>Visibility</td>
                <td>
                  {formatVisibility(metar.visibility, distanceUnit)}{" "}
                  {metar.visibility.ndv && "No directional visibility"}{" "}
                </td>
              </tr>
            )}
            {metar.visibility &&
            (metar.clouds.length || metar.verticalVisibility != null) ? (
              <tr>
                <td>Ceiling</td>
                <td>
                  <Ceiling
                    clouds={metar.clouds}
                    verticalVisibility={metar.verticalVisibility}
                  />
                </td>
              </tr>
            ) : (
              ""
            )}
            {metar.weatherConditions.length ? (
              <tr>
                <td>Weather</td>
                <td>{formatWeather(metar.weatherConditions)}</td>
              </tr>
            ) : undefined}
            {metar.remarks.length ? (
              <tr>
                <td>Remarks</td>
                <td>
                  <Remarks remarks={metar.remarks} />
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </Table>
        <Raw>{aviationWeather.metar.raw}</Raw>
      </Container>
    </Forecasts>
  );
}
