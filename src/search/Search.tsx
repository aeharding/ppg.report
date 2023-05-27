import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrimmedCoordinates } from "../helpers/coordinates";
import { useAppSelector } from "../hooks";
import { search } from "../services/geocode";
import { isTouchDevice } from "../helpers/device";
import { outputP3ColorFromRGB } from "../helpers/colors";
import SubmitButton, { State } from "./SubmitButton";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;
  padding: 0 1em;

  max-width: 500px;
  width: 100%;

  @media (display-mode: standalone) {
    padding-top: 1em;
  }
`;

const Form = styled.form`
  flex: 1;

  display: flex;
  position: relative;

  padding-right: 4em;
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

  backdrop-filter: blur(5px);

  width: 100%;

  margin-right: 1rem;

  font-family: inherit;
  font-weight: 200;

  @media (max-width: 500px) {
    font-size: 1rem;
  }

  &:focus,
  &:hover {
    &:not(:disabled) {
      border-color: #00b7ff;
    }
  }

  &:disabled {
    opacity: 0.75;
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
  text-align: center;
  font-size: 0.9em;
  margin-top: 1em;

  ${outputP3ColorFromRGB([255, 0, 0])};
`;

export default function Search({ ...rest }) {
  const { t } = useTranslation();
  const locationsLength = useAppSelector(
    (state) => state.user.recentLocations.length
  );
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [query]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const { lat, lon } = await search(query);

      navigate(`/${getTrimmedCoordinates(lat, lon)}`);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError("Please check your internet connection and try again.");
      } else {
        setError("Nothing found, please try again.");
      }
      setLoading(false);
      throw e;
    }
  }

  let state = State.Location;
  if (!!query) state = State.Submit;
  if (loading) state = State.Loading;

  return (
    <>
      <Container {...rest}>
        <Form onSubmit={submit} action="#">
          <Input
            type="text"
            enterKeyHint="go"
            autoCorrect="off"
            placeholder={t("Search locations")}
            autoFocus={locationsLength === 0 || !isTouchDevice()}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <SubmitButton
            state={state}
            onLocationFail={() =>
              setError(
                "Fetching current location failed. Please check app permissions."
              )
            }
          />
        </Form>
      </Container>

      {error && <Error>{error}</Error>}
    </>
  );
}
