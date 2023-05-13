import styled from "@emotion/styled";
import { faMountains, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import { metersToFeet } from "../cells/Altitude";
import { Container, Icon, WarningMessage } from "./styles";

/**
 * in meters
 */
export const ELEVATION_DISCREPANCY_THRESHOLD = 160;

const StyledWarningMessage = styled(WarningMessage)`
  ${outputP3ColorFromRGB([0, 200, 200])}
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  padding: 1em;
  width: 1em;
  height: 1em;
  order: 1;
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1em;
  border: 0;
  color: inherit;

  @media (max-width: 660px) {
    float: right;
    margin: 0 0 0 0.5em;
  }

  cursor: pointer;
`;

export default function ReportElevationDiscrepancy() {
  const rap = useAppSelector((state) => state.rap.rap);
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");
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
      <StyledWarningMessage>
        <Icon icon={faMountains} />
        <CloseButton onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <div>
          <strong>Notice</strong> The elevation of your location (
          <strong>
            {Math.round(metersToFeet(elevation)).toLocaleString()}
            ft
          </strong>
          ) is significantly {diffType} than the forecast gridpoint (
          <strong>
            {Math.round(metersToFeet(rapHeight)).toLocaleString()}ft
          </strong>
          ). This often occurs due to nearby hills/mountains. Please be aware
          that weather data may be innacurate due to local atmospheric
          conditions that differ from those in the surrounding areas.
        </div>
      </StyledWarningMessage>
    </Container>
  );
}
