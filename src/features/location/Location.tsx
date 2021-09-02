import { faLocationArrow } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-ui/core";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { useAppDispatch } from "../../hooks";
import { getLocation } from "./locationSlice";

export default function Location({ ...rest }) {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const locate = useCallback(async () => {
    const location = await dispatch(getLocation());

    history.push(
      `/${getTrimmedCoordinates(
        location.coords.latitude,
        location.coords.longitude
      )}`
    );
  }, [dispatch, history]);

  return (
    <IconButton onClick={locate} {...rest}>
      <FontAwesomeIcon icon={faLocationArrow} />
    </IconButton>
  );
}
