/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled/macro";
import { latLng, LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  GeoJSON,
  useMap,
  Circle,
  FeatureGroup,
  Rectangle,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../hooks";
import BaseLayer from "../../../../map/BaseLayer";
import PointInfo from "./PointInfo";
import Legend from "./Legend";
import RefreshInformation from "./RefreshInformation";
import { DataList } from "../../../../DataList";
import { outputP3ColorFromRGB } from "../../../../helpers/colors";
import { css } from "@emotion/react/macro";

const Container = styled.div`
  overflow: hidden;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 350px;
  pointer-events: none;
  background: black; // suppress ios bottom sheet animation flicker

  .weather-geometry {
    ${outputP3ColorFromRGB([255, 0, 0], "stroke")}
    ${outputP3ColorFromRGB([255, 0, 0], "fill")}
    z-index: 2;
    position: relative;
  }
`;

const StyledDataList = styled(DataList)`
  margin: 2rem 1rem 1rem;
`;

// const GreenCircle = styled(Circle)`
//   ${outputP3ColorFromRGB([0, 255, 0], "fill")}
//   ${outputP3ColorFromRGB([0, 255, 0], "stroke")}
// `;

export default function ReportInformation() {
  return (
    <Container>
      <StyledMapContainer
        center={[41.683, -86.25]}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        trackResize={false}
        boxZoom={false}
        zoom={10}
      >
        <BaseLayer />
        <MapController />
      </StyledMapContainer>

      <Legend />

      <StyledDataList>
        <RefreshInformation />

        <PointInfo />
      </StyledDataList>
    </Container>
  );
}

const MapController = () => {
  const { lat, lon } = useParams();
  const rap = useAppSelector((state) => state.rap.rap);
  const weather = useAppSelector((state) => state.weather.weather);
  if (!lat || !lon) throw new Error("lat or lon not defined!");
  if (!rap || typeof rap !== "object")
    throw new Error("RAP report must be defined");

  const map = useMap();
  const groupRef = useRef<any>();

  const myPosition: LatLngExpression = [+lat, +lon];
  const rapPosition: LatLngExpression = [rap[0].lat, -rap[0].lon];

  useEffect(() => {
    if (groupRef.current) map.fitBounds(groupRef.current.getBounds());
  }, [map, groupRef]);

  // do something with map, in a useEffect hook, for example.

  const bounds = latLng(rapPosition).toBounds(40000); // 13km for op40 analysis

  return (
    <FeatureGroup ref={groupRef}>
      <Rectangle
        bounds={bounds}
        css={css`
          ${outputP3ColorFromRGB([0, 0, 255], "fill")}
          ${outputP3ColorFromRGB([0, 0, 255], "stroke")}
        `}
      />
      <Circle
        center={rapPosition}
        fillOpacity={1}
        radius={300}
        css={css`
          ${outputP3ColorFromRGB([0, 0, 255], "fill")}
          ${outputP3ColorFromRGB([0, 0, 255], "stroke")}
        `}
      />

      {weather && typeof weather === "object" && weather.geometry && (
        <GeoJSON
          data={weather.geometry}
          pathOptions={{
            className: "weather-geometry",
          }}
          pane="markerPane"
        />
      )}
      <Circle
        center={myPosition}
        fillOpacity={1}
        radius={300}
        css={css`
          ${outputP3ColorFromRGB([0, 255, 0], "fill")}
          ${outputP3ColorFromRGB([0, 255, 0], "stroke")}
        `}
        pane="tooltipPane"
      />
    </FeatureGroup>
  );
};
