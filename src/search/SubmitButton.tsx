/** @jsxImportSource @emotion/react */

import Location, { Button } from "../features/location/Location";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";
import Spinner from "../shared/Spinner";
import styled from "@emotion/styled";

const transitionName = "submit-loading";

const transitionStyles = css`
  position: absolute;
  right: 0;
  top: 50%;

  transition-duration: 150ms;
  transition-property: opacity, transform;
  transition-timing-function: ease-out;

  transform: translate(0, -50%);

  // enter from
  &.${transitionName}-enter {
    opacity: 0;

    transform: translate(-0.25em, -50%);
  }

  // enter to
  &.${transitionName}-enter-active {
    opacity: 1;

    transform: translate(0, -50%);
  }

  // exit from
  &.${transitionName}-exit {
    opacity: 1;

    transform: translate(0, -50%);
  }

  // exit to
  &.${transitionName}-exit-active {
    opacity: 0;

    transform: translate(0.25em, -50%);
  }
`;

const SpinnerContainer = styled.div`
  width: 2.5em;
  height: 2.5em;
  font-size: 1.7em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export enum State {
  Loading,
  Submit,
  Location,
}

interface AsideButtonProps {
  state: State;
  onLocationFail: () => void;
}

export default function SubmitButton({
  state,
  onLocationFail,
  ...props
}: AsideButtonProps) {
  const contents = (() => {
    switch (state) {
      case State.Location:
        return (
          <Location css={transitionStyles} onLocationFail={onLocationFail} />
        );
      case State.Submit:
        return (
          <Button css={transitionStyles} type="submit">
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        );
      case State.Loading:
        return (
          <SpinnerContainer css={transitionStyles}>
            <Spinner />
          </SpinnerContainer>
        );
    }
  })();

  return (
    <TransitionGroup>
      <CSSTransition
        key={`${state === State.Location}`}
        timeout={150}
        classNames={transitionName}
      >
        {contents}
      </CSSTransition>
    </TransitionGroup>
  );
}
