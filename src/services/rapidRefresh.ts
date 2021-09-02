import Rap, { RapDatum, Sonde, WindUnits } from "../models/Rap";
import { getTrimmedCoordinates } from "../helpers/coordinates";
import axiosCached from "./axiosCached";

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
  const { data: asciiReports } = await axiosCached.get<string>(API_PATH, {
    params: {
      ...BASE_PARAMS,
      airport: getTrimmedCoordinates(+lat, +lon),
    },
  });

  return parseReports(asciiReports);
}

function parseReports(asciiReports: string): Rap[] {
  const rawReports = asciiReports.split(/(\n[\s]*\n)/).filter((r) => r.trim());

  return rawReports.map(parseReport);
}

function parseReport(asciiReport: string): Rap {
  const lines = asciiReport.split("\n");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const headerLine = lines.shift();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dateLine = lines.shift();

  const capeCinLine = lines.shift();

  if (!headerLine || !dateLine || !capeCinLine)
    throw new Error("cape/cin line not returned");

  const { type, date } = parseDateLine(dateLine);

  const { cape, cin } = parseCapeCinLine(capeCinLine);

  const data = parseLines(lines);

  return { headerLine, date, type, cape, cin, ...data };
}

function parseCapeCinLine(capeCinLine: string): { cape: number; cin: number } {
  const parsed = capeCinLine.split(/[ ]+/).filter((s) => s !== "");

  return { cape: +parsed[1], cin: +parsed[3] };
}

function parseDateLine(dateLine: string): { type: string; date: string } {
  const parsed = dateLine.split(/[ ]+/).filter((s) => s !== "");

  return {
    type: parsed[0],
    date: new Date(
      Date.UTC(+parsed[4], getMonth(parsed[3]), +parsed[2], +parsed[1])
    ).toISOString(),
  };
}

function getMonth(mon: string): number {
  return new Date(Date.parse(mon + " 1, 2012")).getMonth();
}

enum RapLineTypes {
  Identification = 1,
  SoundingCheck = 2,
  StationID = 3,
  MandatoryLevel = 4,
  SignificantLevel = 5,
  WindLevel = 6, // GTS or merged data only
  TropopauseLevel = 7, // GTS or merged data only
  MaximumWindLevel = 8, // GTS or merged data only
  SurfaceLevel = 9,
}

function parseLines(lines: string[]) {
  const parsedLines = lines.map((l) => l.split(/[ ]+/).filter((s) => s !== ""));

  const identificationLine = parsedLines.find(
    (l) => +l[0] === RapLineTypes.Identification
  );
  const stationIdLine = parsedLines.find(
    (l) => +l[0] === RapLineTypes.StationID
  );

  if (!identificationLine || !stationIdLine)
    throw new Error("Could not find identification lines for report");

  const identificationData = parseIdentificationLine(identificationLine);
  const stationIdData = parseStationIdLine(stationIdLine);

  const dataLines = parsedLines.filter(
    (l) =>
      +l[0] === RapLineTypes.MandatoryLevel ||
      +l[0] === RapLineTypes.SignificantLevel ||
      +l[0] === RapLineTypes.SurfaceLevel
  );

  const data = parseDataLines(dataLines);

  return { ...identificationData, ...stationIdData, data };
}

interface RapIdentification {
  wban: number;
  wmo: number;
  lat: number;
  lon: number;
  elev: number;
  rtime: number;
}

function parseIdentificationLine([
  _,
  wban,
  wmo,
  lat,
  lon,
  elev,
  rtime,
]: string[]): RapIdentification {
  return parseToNumber({
    wban,
    wmo,
    lat,
    lon,
    elev,
    rtime,
  });
}

interface RapStationId {
  lat: number;
  lon: number;
  sonde: Sonde;
  windUnits: WindUnits;
}

function parseStationIdLine([
  _,
  latlon,
  sonde,
  windUnits,
]: string[]): RapStationId {
  const [lat, lon] = latlon.split(",").map((l) => +l);

  return {
    lat,
    lon,
    sonde: +sonde,
    windUnits: windUnits as WindUnits,
  };
}

function parseDataLines(parsedDataLines: string[][]): RapDatum[] {
  return parsedDataLines.map(parseDataLine).filter(filterInvalidDataLine);
}

function parseDataLine([
  _,
  pressure,
  height,
  temp,
  dewpt,
  windDir,
  windSpd,
]: string[]): RapDatum {
  return parseToNumber({
    pressure,
    height,
    temp,
    dewpt,
    windDir,
    windSpd,
  });
}

function parseToNumber<K>(
  data: Record<keyof K, string>
): Record<keyof K, number> {
  const ret = {} as Record<keyof K, number>;

  Object.keys(data).forEach((key) => {
    ret[key as keyof K] = parseInt(data[key as keyof K]);
  });

  return ret;
}

// 99999 is a test data line (invalid)
function filterInvalidDataLine(dataLine: RapDatum): boolean {
  return dataLine.height !== 99999;
}
