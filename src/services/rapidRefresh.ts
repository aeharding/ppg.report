import Rap, { RapDatum } from "../models/Rap";
import axios from "axios";

// /?data_source=Op40&latest=latest&start_year=2021&start_month_name=Aug&start_mday=20&start_hour=21&start_min=0&n_hrs=1.0&fcst_len=shortest&airport=MSN&text=Ascii%20text%20%28GSL%20format%29&hydrometeors=false&start=latest

const API_PATH = "https://gcl2qf85g3.execute-api.us-east-2.amazonaws.com";

const BASE_PARAMS = {
  data_source: "Op40",
  latest: "latest",
  start_year: 2021,
  start_month_name: "Aug",
  start_mday: 20,
  start_hour: 20,
  start_min: 0,
  n_hrs: "1.0",
  fcst_len: "shortest",
  airport: "MSN",
  text: "Ascii text (GSL format)",
  hydrometeors: false,
  start: "latest",
};

export async function getRap(lat: number, lon: number): Promise<Rap> {
  const { data: asciiReport } = await axios.get<string>(API_PATH, {
    params: BASE_PARAMS,
  });

  return parseReport(asciiReport);
}

function parseReport(asciiReport: string): Rap {
  const lines = asciiReport.split("\n");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const header = lines.shift();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dateLine = lines.shift();

  const capeCinLine = lines.shift();

  if (!capeCinLine) throw new Error("cape/cin line not returned");

  const { cape, cin } = parseCapeCinLine(capeCinLine);

  const data = parseLines(lines);

  return { cape, cin, ...data };
}

function parseCapeCinLine(capeCinLine: string): { cape: number; cin: number } {
  const parsed = capeCinLine.split(/[ ]+/).filter((s) => s !== "");

  return { cape: +parsed[1], cin: +parsed[3] };
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

  if (!identificationLine)
    throw new Error("Could not find identification line for report");

  const identificationData = parseIdentificationLine(identificationLine);

  const dataLines = parsedLines.filter(
    (l) =>
      +l[0] === RapLineTypes.MandatoryLevel ||
      +l[0] === RapLineTypes.SignificantLevel ||
      +l[0] === RapLineTypes.SurfaceLevel
  );

  const data = parseDataLines(dataLines);

  return { ...identificationData, data };
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
