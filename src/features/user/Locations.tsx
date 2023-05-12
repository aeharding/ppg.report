import styled from "@emotion/styled";
import { useAppSelector } from "../../hooks";
import Location from "./Location";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 2rem auto 0;
  padding: 0.5em 0;

  backdrop-filter: blur(5px);

  background-color: rgba(211, 211, 211, 0.043);
  border-radius: 1em;
  box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);

  @media (max-width: 600px) {
    border-radius: 0;
  }
`;

export default function Locations() {
  const locations = useAppSelector((state) => state.user.recentLocations);

  if (!locations.length) return null;

  return (
    <Container>
      {locations.map((location) => (
        <Location location={location} key={`${location.lat}${location.lon}`} />
      ))}
    </Container>
  );
}
