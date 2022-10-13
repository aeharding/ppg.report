import styled from "@emotion/styled/macro";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  AltitudeType,
  setAltitude,
  setSwipeInertia,
  SwipeInertia,
} from "../../../user/userSlice";
import { Radio } from "./Radio";

const Container = styled.div`
  padding: 0.5rem 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function Settings() {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);
  const swipeInertia = useAppSelector((state) => state.user.swipeInertia);

  return (
    <Container>
      <Radio
        label="Altitude"
        options={[AltitudeType.AGL, AltitudeType.MSL]}
        value={altitudeType}
        onChange={(value) => dispatch(setAltitude(value))}
      />
      <Radio
        label="Swipe Inertia"
        options={[SwipeInertia.On, SwipeInertia.Off]}
        value={swipeInertia}
        onChange={(value) => dispatch(setSwipeInertia(value))}
      />
      <p>More settings coming soon! 🚀</p>
      {/* <Radio label="Wind Speed" options={["mph", "km/h", "kts", "m/s"]} />
      <Radio label="Temperature" options={["°F", "°C"]} />
      <Radio label="Elevation" options={["ft", "m"]} /> */}
    </Container>
  );
}
