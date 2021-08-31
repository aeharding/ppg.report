import Location from "../features/location/Location";
import Wind from "../features/wind/Wind";
import Loading from "../shared/Loading";

export default function Home() {
  return (
    <>
      <Location />
      <Wind />
      <Loading />
    </>
  );
}
