/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { latLng, LatLngExpression, divIcon } from "leaflet";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  GeoJSON,
  useMap,
  Circle,
  FeatureGroup,
  Rectangle,
  Marker,
} from "react-leaflet";
import { useAppSelector } from "../../../../hooks";
import BaseLayer from "../../../../map/BaseLayer";
import PointInfo from "./PointInfo";
import Legend from "./Legend";
import RefreshInformation from "./RefreshInformation";
import { DataList } from "../../../../DataList";
import { outputP3ColorFromRGB } from "../../../../helpers/colors";
import { css } from "@emotion/react";
import OSMAttribution from "../../../../map/OSMAttribution";
import MyPosition from "../../../../map/MyPosition";

const Container = styled.div`
  overflow: hidden;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 350px;
  background: black; // suppress ios bottom sheet animation flicker

  &,
  .leaflet-pane * {
    pointer-events: none !important;
  }

  .plane-icon {
    background: none;
    ${outputP3ColorFromRGB([255, 180, 0])}
  }

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

export default function ReportMetadata() {
  const aviationWeather = useAppSelector(
    (state) => state.weather.aviationWeather
  );
  const weather = useAppSelector((state) => state.weather.weather);

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
        maxZoom={9.25}
        zoom={9}
        zoomSnap={undefined}
      >
        <OSMAttribution />
        <BaseLayer />
        <MapController />
      </StyledMapContainer>

      <Legend
        showTaf={!!(aviationWeather && typeof aviationWeather === "object")}
        showNws={!!(weather && typeof weather === "object")}
      />

      <StyledDataList>
        <RefreshInformation />

        <PointInfo />
      </StyledDataList>
    </Container>
  );
}

const planeIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 -0.03 45.7 45.73"><path fill="currentColor" d="m36.038 16.922 7.873-7.303c1.104-1.018 1.737-2.434 1.768-3.935.029-1.5-.562-2.94-1.623-4.002l-.058-.059C42.936.562 41.496-.028 39.996.001c-1.502.03-2.921.667-3.938 1.77l-7.302 7.873L4.57 1.321c-1.459-.504-2.893-.122-3.346.887L.142 4.631C-.31 5.642.363 6.967 1.71 7.719l18.991 10.612-8.547 9.216-4.842-1.046c-.527-.114-1.059.169-1.259.671l-.725 1.826c-.2.501.005 1.062.467 1.34l5.239 3.146 1.188 1.188 3.146 5.24c.278.461.844.659 1.346.461l1.821-.723c.503-.199.785-.729.672-1.255l-1.057-4.883 9.198-8.531L37.96 43.972c.753 1.348 2.077 2.021 3.089 1.568l2.421-1.082c1.011-.452 1.395-1.888.891-3.347l-8.323-24.189z"/></svg>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: "plane-icon",
});

const MapController = () => {
  const windsAloft = useAppSelector((state) => state.weather.windsAloft);
  const weather = useAppSelector((state) => state.weather.weather);
  const aviationWeather = useAppSelector(
    (state) => state.weather.aviationWeather
  );
  if (!windsAloft || typeof windsAloft !== "object")
    throw new Error("RAP report must be defined");

  const map = useMap();
  const groupRef = useRef<any>();

  const rapPosition: LatLngExpression = [
    windsAloft.latitude,
    windsAloft.longitude,
  ];
  const airportPosition: LatLngExpression | undefined =
    aviationWeather && typeof aviationWeather === "object"
      ? [aviationWeather.lat, aviationWeather.lon]
      : undefined;

  useEffect(() => {
    if (groupRef.current)
      map.fitBounds(groupRef.current.getBounds(), {
        padding: [25, 25],
      });
  }, [map, groupRef]);

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
        radius={500}
        css={css`
          ${outputP3ColorFromRGB([0, 0, 255], "fill")}
          ${outputP3ColorFromRGB([0, 0, 255], "stroke")}
        `}
      />

      {airportPosition && (
        <Marker position={airportPosition} icon={planeIcon} pane="markerPane" />
      )}

      {weather && typeof weather === "object" && weather.geometry && (
        <GeoJSON
          data={weather.geometry}
          pathOptions={{
            className: "weather-geometry",
          }}
          pane="markerPane"
        />
      )}

      <MyPosition />
    </FeatureGroup>
  );
};
