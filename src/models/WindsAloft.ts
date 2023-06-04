export interface WindsAloftReport {
  hours: WindsAloftHour[];

  latitude: number;
  longitude: number;

  source: "openMeteo" | "rucSounding";

  elevationInM?: number;
}

export interface WindsAloftHour {
  date: string;
  cin?: number;
  cape: number;

  altitudes: WindsAloftAltitude[];
}

export interface WindsAloftAltitude {
  windSpeedInKph: number;
  windDirectionInDeg: number;
  temperatureInC: number;
  dewpointInC: number;
  altitudeInM: number;
  pressure: number;
}
