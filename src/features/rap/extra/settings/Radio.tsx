import styled from "@emotion/styled/macro";
import {
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "../../../../helpers/colors";

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

export function Radio<T extends string>({
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
