import { fillMissingByAltitude } from "./openMeteo";
import { WindsAloftAltitude } from "../models/WindsAloft";

function altitude(
  altitudeInM: number,
  temperatureInC: number | null,
): WindsAloftAltitude {
  return {
    altitudeInM,
    // Cast: Open-Meteo types these as number but can return null at runtime.
    temperatureInC: temperatureInC as number,
    dewpointInC: 0,
    windSpeedInKph: 0,
    windDirectionInDeg: 0,
    pressure: 0,
  };
}

describe("fillMissingByAltitude", () => {
  it("interpolates a single missing value linearly by altitude", () => {
    // ECMWF (via best_match) returns winds at 80/120/180m AGL but null temps.
    const altitudes = [
      altitude(1592, 24), // surface
      altitude(1672, null), // 80m AGL
      altitude(2004, 12), // lowest pressure level above
    ];

    fillMissingByAltitude(altitudes, "temperatureInC");

    // (1672 - 1592) / (2004 - 1592) = 80 / 412 of the way from 24 -> 12
    expect(altitudes[1].temperatureInC).toBeCloseTo(
      24 + (80 / 412) * (12 - 24),
    );
  });

  it("interpolates several consecutive missing values onto the same line", () => {
    const altitudes = [
      altitude(0, 20),
      altitude(80, null),
      altitude(120, null),
      altitude(180, null),
      altitude(400, 10), // 0.025 degC/m gradient
    ];

    fillMissingByAltitude(altitudes, "temperatureInC");

    expect(altitudes[1].temperatureInC).toBeCloseTo(18);
    expect(altitudes[2].temperatureInC).toBeCloseTo(17);
    expect(altitudes[3].temperatureInC).toBeCloseTo(15.5);
  });

  it("treats NaN as missing", () => {
    const altitudes = [altitude(0, 20), altitude(100, NaN), altitude(200, 10)];

    fillMissingByAltitude(altitudes, "temperatureInC");

    expect(altitudes[1].temperatureInC).toBeCloseTo(15);
  });

  it("falls back to the nearest value when there is no neighbor above", () => {
    const altitudes = [altitude(0, 20), altitude(100, 15), altitude(200, null)];

    fillMissingByAltitude(altitudes, "temperatureInC");

    expect(altitudes[2].temperatureInC).toBe(15);
  });

  it("falls back to the nearest value when there is no neighbor below", () => {
    const altitudes = [altitude(0, null), altitude(100, 15), altitude(200, 10)];

    fillMissingByAltitude(altitudes, "temperatureInC");

    expect(altitudes[0].temperatureInC).toBe(15);
  });

  it("leaves valid values untouched", () => {
    const altitudes = [altitude(0, 20), altitude(100, 17), altitude(200, 10)];

    fillMissingByAltitude(altitudes, "temperatureInC");

    expect(altitudes.map((a) => a.temperatureInC)).toEqual([20, 17, 10]);
  });
});
