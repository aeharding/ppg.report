/** @jsxImportSource @emotion/react */

import Location, { Button } from "../features/location/Location";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { css } from "@emotion/react/macro";

const transitionName = "transition";

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

interface AsideButtonProps {
  shouldSubmit: boolean;
}

export default function SubmitButton({
  shouldSubmit,
  ...props
}: AsideButtonProps) {
  const contents = (() => {
    if (shouldSubmit) {
      return (
        <Button css={transitionStyles} type="submit">
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      );
    }

    return <Location css={transitionStyles} />;
  })();

  return (
    <TransitionGroup>
      <CSSTransition
        key={`${shouldSubmit}`}
        timeout={150}
        classNames={transitionName}
      >
        {contents}
      </CSSTransition>
    </TransitionGroup>
  );
}
