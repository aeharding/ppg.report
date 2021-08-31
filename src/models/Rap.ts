export default interface Rap {
  cin: number;
  cape: number;
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
