import styled from "@emotion/styled/macro";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UserLocation } from "./storage";
import { removeLocation } from "./userSlice";

const RemoveIcon = styled(FontAwesomeIcon)`
  margin-left: auto;
  font-size: 1.5rem;
  padding: 1rem;
  box-sizing: content-box;
  opacity: 0.5;
  transform: scale(0.95);

  transition: 100ms ease-out;
  transition-property: opacity, transform;

  &:hover {
    color: red;
  }
`;

const Label = styled.span`
  transition: transform 100ms ease-out;

  transform-origin: left center;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 2em;
  height: 4rem;
  transition: background-color 100ms ease-out;

  &:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.1);

    ${Label} {
      transform: scale(1.015);
      font-weight: 500;
    }

    ${RemoveIcon} {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

interface LocationProps {
  location: UserLocation;
}

export default function Location({ location }: LocationProps) {
  const dispatch = useDispatch();

  function remove(e: React.MouseEvent, location: UserLocation) {
    e.stopPropagation();
    e.preventDefault();

    dispatch(removeLocation(location));
  }

  return (
    <StyledLink to={`/${location.lat},${location.lon}`}>
      <Label>{location.label}</Label>{" "}
      <RemoveIcon icon={faTimes} onClick={(e) => remove(e, location)} />
    </StyledLink>
  );
}
