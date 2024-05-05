import { AviationAlertFeature } from "../services/aviationWeather";
import { findRelatedAlerts } from "./weather";

const aviationAlerts: AviationAlertFeature[] = [
  {
    id: "35782-1825850",
    properties: {
      data: "GAIRMET",
      product: "TANGO",
      hazard: "TURB-LO",
      severity: "MOD",
      top: "060",
      base: "SFC",
      issueTime: "2022-09-26T08:45:00Z",
      validTime: "2022-09-26T12:00:00Z",
      forecast: "3",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-97.79, 48.99],
          [-88.35, 48.11],
          [-85.68, 46.89],
          [-83.72, 43.03],
          [-83.38, 42.09],
          [-85.96, 39.92],
          [-90.62, 39.27],
          [-95.02, 41.42],
          [-97.79, 48.99],
        ],
      ],
    },
  },
  {
    id: "35790-1826090",
    properties: {
      data: "GAIRMET",
      product: "TANGO",
      hazard: "TURB-LO",
      severity: "MOD",
      top: "060",
      base: "SFC",
      issueTime: "2022-09-26T14:45:00Z",
      validTime: "2022-09-26T15:00:00Z",
      forecast: "0",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-92.68, 48.97],
          [-89.61, 48.44],
          [-85.61, 46.98],
          [-84.6, 44.63],
          [-82.64, 42.94],
          [-83.54, 42.19],
          [-85.21, 40.99],
          [-87.44, 40.86],
          [-90.52, 38.86],
          [-94.29, 41.94],
          [-95.5, 46.39],
          [-92.68, 48.97],
        ],
      ],
    },
  },
  {
    id: "35790-1826094",
    properties: {
      data: "GAIRMET",
      product: "TANGO",
      hazard: "TURB-LO",
      severity: "MOD",
      top: "060",
      base: "SFC",
      issueTime: "2022-09-26T14:45:00Z",
      validTime: "2022-09-26T18:00:00Z",
      forecast: "3",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-93.62, 48.98],
          [-88.76, 48.26],
          [-82.42, 45.23],
          [-82.14, 42.91],
          [-85.13, 41.12],
          [-89.09, 40.8],
          [-93.19, 43.54],
          [-94.63, 47.11],
          [-93.62, 48.98],
        ],
      ],
    },
  },
  {
    id: "35790-1826100",
    properties: {
      data: "GAIRMET",
      product: "TANGO",
      hazard: "TURB-LO",
      severity: "MOD",
      top: "060",
      base: "SFC",
      issueTime: "2022-09-26T14:45:00Z",
      validTime: "2022-09-26T21:00:00Z",
      forecast: "6",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-93.51, 49.07],
          [-89.05, 48.18],
          [-82.32, 45.24],
          [-82.22, 43.44],
          [-83.35, 42.05],
          [-85.25, 40.89],
          [-87.89, 40.88],
          [-91.86, 43.12],
          [-93.71, 46.25],
          [-93.51, 49.07],
        ],
      ],
    },
  },
];

describe("findRelatedAlerts", () => {
  test("finds all adjoined related alerts (12:00, 15:00, 18:00, 21:00)", () => {
    expect(findRelatedAlerts(aviationAlerts[0], aviationAlerts)).toHaveLength(
      4,
    );
  });

  test("with gap (12:00, 18:00, 21:00), targetting 12:00, only finds 12:00", () => {
    const modifiedAlerts = [...aviationAlerts];
    modifiedAlerts.splice(1, 1);

    expect(findRelatedAlerts(modifiedAlerts[0], modifiedAlerts)).toHaveLength(
      1,
    );
  });

  test("with gap (12:00, 18:00, 21:00), targetting 18:00, only finds 18:00, 21:00", () => {
    const modifiedAlerts = [...aviationAlerts];
    modifiedAlerts.splice(1, 1);

    expect(findRelatedAlerts(modifiedAlerts[1], modifiedAlerts)).toHaveLength(
      2,
    );
  });

  test("with gap (12:00, 18:00, 21:00), targetting 21:00, only finds 18:00, 21:00", () => {
    const modifiedAlerts = [...aviationAlerts];
    modifiedAlerts.splice(1, 1);

    expect(findRelatedAlerts(modifiedAlerts[2], modifiedAlerts)).toHaveLength(
      2,
    );
  });
});
