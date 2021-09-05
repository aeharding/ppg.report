import styled from "@emotion/styled/macro";
import { faLocationArrow } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { useAppDispatch } from "../../hooks";
import * as storage from "../user/storage";
import { getLocation } from "./locationSlice";

const Button = styled.button`
  font-size: 1.7em;
  width: 2.5em;
  height: 2.5em;

  appearance: none;
  border: 0;
  background: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  &:hover {
    color: #00b7ff;
  }

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export default function Location({ ...rest }) {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const locate = useCallback(async () => {
    const location = await dispatch(getLocation());

    const matchedLocation = storage.findLocation(location.coords);

    if (matchedLocation) {
      history.push(`${matchedLocation.lat},${matchedLocation.lon}`);
    } else {
      history.push(
        `/${getTrimmedCoordinates(
          location.coords.latitude,
          location.coords.longitude
        )}`
      );
    }
  }, [dispatch, history]);

  return (
    <Button onClick={locate} {...rest}>
      <FontAwesomeIcon icon={faLocationArrow} />
    </Button>
  );
}
