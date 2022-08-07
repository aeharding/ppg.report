import styled from "@emotion/styled/macro";
import {
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "../../../../helpers/colors";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { AltitudeType, updateAltitude } from "../../../user/userSlice";

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
        onChange={(value) => dispatch(updateAltitude(value))}
      />
      {/* <Radio label="Wind Speed" options={["mph", "km/h", "kts", "m/s"]} />
      <Radio label="Temperature" options={["°F", "°C"]} />
      <Radio label="Elevation" options={["ft", "m"]} /> */}
    </Container>
  );
}

const GroupLabel = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  display: none;

  &:checked + label {
    ${outputP3ColorFromRGB([0, 255, 0])}
    ${outputP3ColorFromRGBA([0, 255, 0, 0.1], "background")}
  }
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  padding: 0.5rem 0.5rem;
  min-width: 4rem;
  border: 1px solid;
  color: #bbb;
  border-radius: 2rem;
  margin-right: 0.5rem;
`;

interface RadioProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label: string;
}

function Radio<T extends string>({
  options,
  label,
  onChange,
  value,
}: RadioProps<T>) {
  return (
    <div>
      <GroupLabel>{label}</GroupLabel>
      {options.map((option) => (
        <>
          <Input
            type="radio"
            name={label}
            checked={value === option}
            value={option}
            id={option}
            onChange={(event) => onChange(event.target.value as T)}
          />
          <Label htmlFor={option}>{option}</Label>
        </>
      ))}
    </div>
  );
}
