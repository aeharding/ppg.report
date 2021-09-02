import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { getGeocode } from "../../features/geocode/geocodeSlice";

interface ReverseLocationProps {
  lat: number;
  lon: number;
}

export default function ReverseLocation({ lat, lon }: ReverseLocationProps) {
  const dispatch = useAppDispatch();
  const geocodeByCoordinates = useAppSelector(
    (state) => state.geocode.geocodeByCoordinates
  );
  useEffect(() => {
    dispatch(getGeocode(+lat, +lon));
  }, [dispatch, lat, lon]);

  const geocode = geocodeByCoordinates[`${lat},${lon}`];

  switch (geocode) {
    case undefined:
    case "failed":
    case "pending":
      return null;
    default:
      return <>{geocode.label}</>;
  }
}
