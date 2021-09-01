import { Redirect } from "react-router-dom";
import Location from "../features/location/Location";
import Wind from "../features/wind/Wind";
import { useAppSelector } from "../hooks";
import Loading from "../shared/Loading";

export default function Home() {
  const location = useAppSelector((state) => state.location.location);

  function renderHome() {
    switch (location) {
      case "pending":
        return <Loading />;
      case "failed":
        return <>Failed to fetch location.</>;
      default:
        return (
          <Redirect
            push={false}
            to={`/${location.coords.latitude.toPrecision(
              5
            )},${location.coords.longitude.toPrecision(5)}`}
          />
        );
    }
  }

  return (
    <>
      <Location />
      <Wind />
      {renderHome()}
      <Loading />
    </>
  );
}
