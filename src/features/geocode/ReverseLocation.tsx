import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { getGeocode } from "../../features/geocode/geocodeSlice";
import {
  getTrimmedCoordinates,
  isLatLonTrimmed,
} from "../../helpers/coordinates";
import { visitedLocation } from "../user/userSlice";

interface ReverseLocationProps {
  lat: string;
  lon: string;
}

export default function ReverseLocation({ lat, lon }: ReverseLocationProps) {
  const dispatch = useAppDispatch();
  const geocodeByCoordinates = useAppSelector(
    (state) => state.geocode.geocodeByCoordinates
  );
  const geocode = geocodeByCoordinates[getTrimmedCoordinates(+lat, +lon)];

  useEffect(() => {
    switch (geocode) {
      case undefined:
      case "failed":
      case "pending":
        return;
      default:
        dispatch(visitedLocation(geocode));
    }
  }, [geocode, dispatch]);

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getGeocode(+lat, +lon));
  }, [dispatch, lat, lon]);

  switch (geocode) {
    case undefined:
    case "failed":
    case "pending":
      return null;
    default:
      return <>{geocode.label}</>;
  }
}
