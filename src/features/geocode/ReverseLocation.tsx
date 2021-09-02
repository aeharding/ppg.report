import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { getGeocode } from "../../features/geocode/geocodeSlice";
import {
  getTrimmedCoordinates,
  isLatLonTrimmed,
} from "../../helpers/coordinates";

interface ReverseLocationProps {
  lat: string;
  lon: string;
}

export default function ReverseLocation({ lat, lon }: ReverseLocationProps) {
  const dispatch = useAppDispatch();
  const geocodeByCoordinates = useAppSelector(
    (state) => state.geocode.geocodeByCoordinates
  );

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getGeocode(+lat, +lon));
  }, [dispatch, lat, lon]);

  const geocode = geocodeByCoordinates[getTrimmedCoordinates(+lat, +lon)];

  switch (geocode) {
    case undefined:
    case "failed":
    case "pending":
      return null;
    default:
      return <>{geocode.label}</>;
  }
}
