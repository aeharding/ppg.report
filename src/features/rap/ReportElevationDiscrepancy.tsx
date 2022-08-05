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
  padding: 1rem;
  margin: 1rem;
  gap: 1rem;
  position: relative;

  font-size: 0.9em;

  @media (max-width: 500px) {
    flex-direction: column;
    text-align: justify;
  }

  ${outputP3ColorFromRGB([0, 200, 200])}
  background: #010f26a0;
  border-color: #000064;
  border: 1px solid;
  border-radius: 1rem;
`;

const MountainIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 0;
  color: inherit;

  @media (max-width: 500px) {
    position: absolute;
    top: 0.8rem;
    right: 1rem;
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
    console.log("close");
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
        <div>
          <strong>Notice</strong> The elevation of your location (
          {Math.round(metersToFeet(elevation)).toLocaleString()}
          ft) is significantly {diffType} than the forecast gridpoint (
          {Math.round(metersToFeet(rapHeight)).toLocaleString()}ft). This often
          occurs due to nearby hills/mountains. Please be aware that weather
          data may be innacurate due to local atmospheric conditions that differ
          from those in the surrounding areas.
        </div>
        <CloseButton onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </WarningMessage>
    </Container>
  );
}
