import styled from "@emotion/styled/macro";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Location from "./features/location/Location";
import { getTrimmedCoordinates } from "./helpers/coordinates";
import { useAppSelector } from "./hooks";
import { search } from "./services/geocode";
import { isTouchDevice } from "./helpers/device";

const Container = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  padding: 0 1em;

  max-width: 500px;
  width: 100%;
`;

const Form = styled.form`
  flex: 1;

  display: flex;
  position: relative;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.15);
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  height: 3rem;
  font-size: 1.5em;
  outline: 0;
  padding: 0 2rem;
  color: var(--text);

  width: 100%;

  margin-right: 1rem;

  font-family: inherit;
  font-weight: 200;

  @media (max-width: 500px) {
    font-size: 1rem;
  }

  &:focus,
  &:hover {
    border-color: #00b7ff;
  }

  &::placeholder {
    color: var(--text);
    opacity: 1;
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
`;

const Error = styled.div`
  @media (min-width: 500px) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    transform: translateY(calc(100% + 1em));
  }

  text-align: center;
  font-size: 0.9em;
  margin-top: 1em;

  color: red;
`;

export default function Search({ ...rest }) {
  const locationsLength = useAppSelector(
    (state) => state.user.recentLocations.length
  );
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

      history.push(`/${getTrimmedCoordinates(lat, lon)}`);
    } catch (e) {
      setError("Nothing found, please try again.");
    }
  }

  return (
    <Container {...rest}>
      <Form onSubmit={submit} action="#">
        <Input
          type="text"
          enterKeyHint="go"
          placeholder="Search locations"
          autoFocus={locationsLength === 0 || !isTouchDevice()}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {error && <Error>{error}</Error>}
      </Form>
      <Location />
    </Container>
  );
}
