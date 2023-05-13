import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Container = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  margin: 1em;
  gap: 1em;
  position: relative;

  font-size: 0.9em;

  @media (max-width: 660px) {
    display: block;
    text-align: justify;

    margin: 0 0 1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;

    font-size: 0.8em;
  }

  background: #010f26a0;
  border-color: #000064;
  border: 1px solid;
  border-radius: 1em;
`;

export const Icon = styled(FontAwesomeIcon)`
  font-size: 1.5em;

  @media (max-width: 660px) {
    display: none;
  }
`;
