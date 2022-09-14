import axios from "axios";
import { addHours, differenceInHours } from "date-fns";
import parse, { Rap } from "gsl-parser";
import { getTrimmedCoordinates } from "../helpers/coordinates";
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

export async function getRap(
  lat: number,
  lon: number,
  data_source: "Op40" | "GFS" = "Op40"
): Promise<Rap[]> {
  const report = await _getRap(lat, lon, data_source);

  const hoursStale = differenceInHours(new Date(), new Date(report[0].date));

  if (hoursStale > 4) {
    const reportAdditional = await _getRap(
      lat,
      lon,
      data_source,
      hoursStale - 2,
      addHours(new Date(report[report.length - 1].date), 1)
    );

    return [...report, ...reportAdditional];
  }

  return report;
}

async function _getRap(
  lat: number,
  lon: number,
  data_source: "Op40" | "GFS" = "Op40",
  hours = 24,
  start?: Date
) {
  const { data: asciiReports } = await axios.get<string>(API_PATH, {
    params: {
      ...BASE_PARAMS,
      data_source,
      airport: getTrimmedCoordinates(+lat, +lon),
      ...generateStartParams(hours, start),
    },
  });

  const report = parse(asciiReports);

  // Sometimes rapid refresh returns status=200 with empty body
  if (report.length === 0) throw new Error("Report is empty");

  return report;
}

function generateStartParams(
  hours: number,
  start?: Date
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
