// Documentation: https://rucsoundings.noaa.gov/raob_format.html

export default interface Rap {
  headerLine: string;
  type: string;
  date: string;
  cin: number;
  cape: number;
  windUnits: WindUnits;
  lat: number;
  lon: number;
  sonde: Sonde;

  data: RapDatum[];
}

export interface RapDatum {
  pressure: number;
  height: number;
  temp: number;
  dewpt: number;
  windDir: number;
  windSpd: number;
  hhmm?: number;
  bearing?: number;
  range?: number;
}

export enum WindUnits {
  KT = "kt",
  MS = "ms",
}

export enum Sonde {
  TypeA = 10,
  TypeC = 11,
  SpaceDataCorp = 12,
}
