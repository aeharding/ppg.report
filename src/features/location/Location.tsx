import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { getLocation } from "./locationSlice";

export default function Location() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  return null;
}
