import axios from "axios";
import { addHours, differenceInHours } from "date-fns";
import parse, { Rap } from "gsl-parser";
import { getTrimmedCoordinates } from "../helpers/coordinates";
import { WindsAloftReport } from "../models/WindsAloft";
// Documentation: https://rucsoundings.noaa.gov/text_sounding_query_parameters.pdf
// /?data_source=Op40&latest=latest&start_year=2021&start_month_name=Aug&start_mday=20&start_hour=21&start_min=0&n_hrs=1.0&fcst_len=shortest&airport=MSN&text=Ascii%20text%20%28GSL%20format%29&hydrometeors=false&start=latest

const API_PATH = "/api/rap";

const BASE_PARAMS = {
  latest: "latest",
  // start_year: 2021,
  // start_month_name: "Aug",
  // start_mday: 20,
  // start_hour: 20,
  // start_min: 0,
  fcst_len: "shortest",
  text: "Ascii text (GSL format)",
  hydrometeors: false,
};

export async function getWindsAloft(
  lat: number,
  lon: number,
  data_source: "Op40" | "GFS" = "Op40",
): Promise<WindsAloftReport> {
  return transformRapToWindsAloft(await getRap(lat, lon, data_source));
}

function transformRapToWindsAloft(rap: Rap[]): WindsAloftReport {
  return {
    latitude: rap[0].lat,
    longitude: -rap[0].lon,
    source: "rucSounding",
    hours: rap.map(({ cape, cin, date, data }) => ({
      date,
      cape,
      cin,
      altitudes: data.map(
        ({ height, temp, windDir, windSpd, pressure, dewpt }) => ({
          windSpeedInKph: windSpd * 1.852,
          windDirectionInDeg: windDir,
          temperatureInC: temp / 10,
          altitudeInM: height,
          pressure: Math.round(pressure / 10),

          // Based on everything I've seen, invalid dewpt values are
          // due to extremely low dewpts. So just set to -100°C.
          dewpointInC: dewpt != null ? dewpt / 10 : -100,
        }),
      ),
    })),
  };
}

async function getRap(
  lat: number,
  lon: number,
  data_source: "Op40" | "GFS" = "Op40",
): Promise<Rap[]> {
  const report = await _getRap(lat, lon, data_source);

  const hoursStale = differenceInHours(new Date(), new Date(report[0].date));

  if (hoursStale > 4) {
    try {
      const reportAdditional = await _getRap(
        lat,
        lon,
        data_source,
        hoursStale - 2,
        addHours(new Date(report[report.length - 1].date), 1),
      );

      return [...report, ...reportAdditional];
    } catch (e) {
      console.error(
        "Error fetching additional rapidRefresh data (are you offline?)",
        e,
      );
    }
  }

  return report;
}

async function _getRap(
  lat: number,
  lon: number,
  data_source: "Op40" | "GFS" = "Op40",
  hours = 30,
  start?: Date,
) {
  const { data: asciiReports } = await axios.get<string>(API_PATH, {
    params: {
      ...BASE_PARAMS,
      data_source,
      airport: getTrimmedCoordinates(+lat, +lon),
      ...generateStartParams(hours, start),
    },
    paramsSerializer: {
      // For some reason encoding spaces stopped working sometime ~ April 2023
      // So instead, don't encode, just pass through (this is a bit dangerous though
      // if we pass anything with & symbol for example)
      encode: (params) => params,
    },
  });

  const report = parse(asciiReports);

  // Sometimes rapid refresh returns status=200 with empty body
  if (report.length === 0) throw new Error("Report is empty");

  return report;
}

function generateStartParams(
  hours: number,
  start?: Date,
): Record<string, string | number> {
  if (!start)
    return {
      start: "latest",
      n_hrs: `${hours}.0`,
    };

  return {
    startSecs: Math.round(start.getTime() / 1000),
    endSecs: Math.round(start.getTime() / 1000 + hours * 60 * 60),
  };
}
