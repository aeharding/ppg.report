import axios from "axios";
import parse, { Rap } from "gsl-parser";
import { getTrimmedCoordinates } from "../helpers/coordinates";
// Documentation: https://rucsoundings.noaa.gov/text_sounding_query_parameters.pdf
// /?data_source=Op40&latest=latest&start_year=2021&start_month_name=Aug&start_mday=20&start_hour=21&start_min=0&n_hrs=1.0&fcst_len=shortest&airport=MSN&text=Ascii%20text%20%28GSL%20format%29&hydrometeors=false&start=latest

const API_PATH = "/api/rap";

const BASE_PARAMS = {
  data_source: "Op40",
  latest: "latest",
  // start_year: 2021,
  // start_month_name: "Aug",
  // start_mday: 20,
  // start_hour: 20,
  // start_min: 0,
  n_hrs: "24.0",
  fcst_len: "shortest",
  text: "Ascii text (GSL format)",
  hydrometeors: false,
  start: "latest",
};

export async function getRap(lat: number, lon: number): Promise<Rap[]> {
  const { data: asciiReports } = await axios.get<string>(API_PATH, {
    params: {
      ...BASE_PARAMS,
      airport: getTrimmedCoordinates(+lat, +lon),
    },
  });

  return parse(asciiReports);
}
