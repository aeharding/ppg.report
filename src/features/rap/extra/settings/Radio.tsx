import styled from "@emotion/styled";
import {
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "../../../../helpers/colors";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { scrollIntoViewIfNeeded } from "../../../../helpers/dom";
import DraggableScrollView from "../../../../shared/DraggableScrollView";

const GroupLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const GroupTip = styled.div`
  font-size: 0.8em;
  opacity: 0.8;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
`;

const Options = styled(DraggableScrollView)`
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  margin: 0 -1rem;
  padding: 0 1rem;
  scroll-padding: 2rem;

  > * {
    flex-shrink: 0;
  }

  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
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

  padding: 0.5rem 0.85rem;
  min-width: 4rem;
  border: 1px solid;
  color: #888;
  border-radius: 2rem;
`;

interface RadioProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label: string;
  tip?: string;
}

export function Radio<T extends string>({
  options,
  label,
  onChange,
  value,
  tip,
}: RadioProps<T>) {
  // Cached value provides instant update
  const [cachedValue, setCachedValue] = useState(value);

  useEffect(() => {
    setCachedValue(value);
  }, [value]);

  return (
    <div>
      <GroupLabel>{label}</GroupLabel>
      {tip ? <GroupTip>{tip}</GroupTip> : ""}
      <Options>
        {options.map((option) => (
          <React.Fragment key={option}>
            <InputWithScrollTo
              label={label}
              type="radio"
              name={label}
              checked={cachedValue === option}
              value={option}
              id={`${label}${option}`}
              onChange={(event) => {
                setCachedValue(event.target.value as T);

                setTimeout(() => {
                  onChange(event.target.value as T);
                }, 50);
              }}
            />
          </React.Fragment>
        ))}
      </Options>
    </div>
  );
}

interface InputWithScrollToProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputWithScrollTo({
  checked,
  label,
  ...props
}: InputWithScrollToProps) {
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (!labelRef.current) return;
    setInitial(false);
    if (!checked) return;

    scrollIntoViewIfNeeded(labelRef.current, !initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, labelRef]);

  return (
    <>
      <Input {...props} checked={checked} />
      <Label htmlFor={`${label}${props.value}`} ref={labelRef}>
        {props.value}
      </Label>
    </>
  );
}
