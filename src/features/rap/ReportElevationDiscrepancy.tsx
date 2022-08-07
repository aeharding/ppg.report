import styled from "@emotion/styled/macro";
import { faMountains, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { outputP3ColorFromRGB } from "../../helpers/colors";
import { useAppSelector } from "../../hooks";
import { metersToFeet } from "./cells/Altitude";

/**
 * in meters
 */
export const ELEVATION_DISCREPANCY_THRESHOLD = 160;

const Container = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  margin: 1em;
  gap: 1em;
  position: relative;

  font-size: 0.9em;

  @media (max-width: 500px) {
    display: block;
    text-align: justify;

    margin: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;

    font-size: 0.75em;
  }

  ${outputP3ColorFromRGB([0, 200, 200])}
  background: #010f26a0;
  border-color: #000064;
  border: 1px solid;
  border-radius: 1em;
`;

const MountainIcon = styled(FontAwesomeIcon)`
  font-size: 1.5em;

  @media (max-width: 500px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  padding: 1em;
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1em;
  border: 0;
  color: inherit;

  @media (max-width: 500px) {
    float: right;
    margin: 0 0 0 0.5em;
  }

  cursor: pointer;
`;

export default function ReportElevationDiscrepancy() {
  const rap = useAppSelector((state) => state.rap.rap);
  const { lat, lon } = useParams();
  const storageKey = `elevation-alert-closed-${lat},${lon}`;
  const elevation = useAppSelector((state) => state.weather.elevation);
  const [closed, setClosed] = useState(!!localStorage.getItem(storageKey));

  function close() {
    localStorage.setItem(storageKey, "1");
    setClosed(true);
  }

  if (closed) return <></>;

  if (!rap || typeof rap !== "object" || typeof elevation !== "number")
    return <></>;

  const rapHeight = rap[0].data[0].height;

  if (Math.abs(elevation - rapHeight) < ELEVATION_DISCREPANCY_THRESHOLD)
    return <></>;

  const diffType = rapHeight - elevation > 0 ? "lower" : "higher";

  return (
    <Container>
      <WarningMessage>
        <MountainIcon icon={faMountains} />
        <CloseButton onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <strong>Notice</strong> The elevation of your location (
        {Math.round(metersToFeet(elevation)).toLocaleString()}
        ft) is significantly {diffType} than the forecast gridpoint (
        {Math.round(metersToFeet(rapHeight)).toLocaleString()}ft). This often
        occurs due to nearby hills/mountains. Please be aware that weather data
        may be innacurate due to local atmospheric conditions that differ from
        those in the surrounding areas.
      </WarningMessage>
    </Container>
  );
}
