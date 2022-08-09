import styled from "@emotion/styled/macro";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { AltitudeType, setAltitude } from "../../../user/userSlice";
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

  return (
    <Container>
      <Radio
        label="Altitude"
        options={[AltitudeType.AGL, AltitudeType.MSL]}
        value={altitudeType}
        onChange={(value) => dispatch(setAltitude(value))}
      />
      <p>More settings coming soon! 🚀</p>
      {/* <Radio label="Wind Speed" options={["mph", "km/h", "kts", "m/s"]} />
      <Radio label="Temperature" options={["°F", "°C"]} />
      <Radio label="Elevation" options={["ft", "m"]} /> */}
    </Container>
  );
}
