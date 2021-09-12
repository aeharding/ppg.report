import styled from "@emotion/styled/macro";
import { faLocationArrow } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { getPosition } from "../../services/position";
import * as storage from "../user/storage";

export const Button = styled.button`
  font-size: 1.7em;
  width: 2.5em;
  height: 2.5em;
  padding: 0;

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

interface LocationProps {
  onLocationFail: () => void;
  className?: string;
}

export default function Location({ onLocationFail, ...rest }: LocationProps) {
  const history = useHistory();

  const locate = useCallback(async () => {
    let position: GeolocationPosition;

    try {
      position = await getPosition();
    } catch (e) {
      onLocationFail();
      throw e;
    }

    const matchedLocation = storage.findLocation(position.coords);

    if (matchedLocation) {
      history.push(`${matchedLocation.lat},${matchedLocation.lon}`);
    } else {
      history.push(
        `/${getTrimmedCoordinates(
          position.coords.latitude,
          position.coords.longitude
        )}`
      );
    }
  }, [history, onLocationFail]);

  return (
    <Button
      type="button"
      onClick={locate}
      aria-label="Use current location"
      {...rest}
    >
      <FontAwesomeIcon icon={faLocationArrow} />
    </Button>
  );
}
