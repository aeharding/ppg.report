import styled from "@emotion/styled/macro";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Location from "./features/location/Location";
import { search } from "./services/geocode";

const Container = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  position: relative;
`;

const Input = styled.input`
  background: none;
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  height: 3rem;
  font-size: 1.5em;
  outline: 0;
  padding: 0 2rem;
  color: white;

  margin-right: 1rem;

  font-family: inherit;
  font-weight: 200;

  &:focus,
  &:hover {
    border-color: #00b7ff;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const StyledLocation = styled(Location)`
  && {
    width: 60px;
    height: 60px;
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      color: #00b7ff;
    }
  }

  svg {
    font-size: 1.4em;
  }
`;

const Error = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  transform: translateY(calc(100% + 1em));

  text-align: center;
  font-size: 0.9em;
  margin-top: 1em;

  color: red;
`;

export default function Search({ ...rest }) {
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [query]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const { lat, lon } = await search(query);

      history.push(`/${lat.toPrecision(6)},${lon.toPrecision(6)}`);
    } catch (e) {
      setError("Nothing found, please try again.");
    }
  }

  return (
    <Container {...rest}>
      <Form onSubmit={submit}>
        <Input
          type="search"
          placeholder="Search locations"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {error && <Error>{error}</Error>}
      </Form>
      <StyledLocation />
    </Container>
  );
}
