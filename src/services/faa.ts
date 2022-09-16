import axios from "axios";
import { GeoJsonObject } from "geojson";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

export interface TFRFeature {
  properties: {
    coreNOTAMData: {
      notamEvent: {
        scenario: string;
      };
      notam: {
        id: string;
        number: string;
        type: string;
        issued: string;
        selectionCode: string;
        location: string;
        effectiveStart: string;
        effectiveEnd: string;
        text: string;
        classification: string;
        accountId: string;
        lastUpdated: string;
        icaoLocation: string;
        coordinates: string;
      };
      notamTranslation: {
        type: string;
        simpleText: string;
      }[];
    };
  };
  geometry: GeoJsonObject | null;
}

export async function getTFRs({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<TFRFeature[]> {
  const { data } = await axios.get(`/api/tfr`, {
    params: {
      lat,
      lon,
      radialDistance: 32000, // meters. ~ 10 miles
    },
  });

  // Sometimes, if a TFR covers multiple offices, there's duplicates
  return uniqWith(
    data.items,
    (a, b) =>
      isEqual(a.geometry, b.geometry) &&
      isEqual(
        a.properties.coreNOTAMData.notam.text,
        b.properties.coreNOTAMData.notam.text
      )
  );
}
