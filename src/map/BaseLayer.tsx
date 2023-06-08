import React from "react";
import styled from "@emotion/styled";
import { TileLayer } from "react-leaflet";

// eslint-disable-next-line
import "leaflet/dist/leaflet.css";

const InvertedTileLayer = styled(TileLayer)`
  /* filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); */
`;

export default function BaseLayer() {
  return (
    <InvertedTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  );
}
