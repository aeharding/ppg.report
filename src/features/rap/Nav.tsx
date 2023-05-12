import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { detect } from "detect-browser";
import React from "react";
import { isTouchDevice } from "../../helpers/device";

const browser = detect();

const Container = styled.div<{ flip: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;

  display: flex;

  ${({ flip }) =>
    flip &&
    css`
      justify-content: flex-end;
    `}
`;

const Button = styled.div<{ flip: boolean; visible: boolean }>`
  position: sticky;
  top: 50%;
  width: 5em;
  height: 10em;
  padding: 6em 2rem 6em 1rem;
  pointer-events: auto;

  font-size: 0.85em;

  @media (max-width: 600px) {
    font-size: 0.7em;
  }

  z-index: 1;

  box-sizing: content-box;

  stroke-width: 0.3px;
  cursor: pointer;

  opacity: 0;

  transform-origin: right center;
  transition: 100ms ease-out;
  transition-property: opacity, transform;

  ${({ visible }) =>
    !visible &&
    css`
      pointer-events: none;
    `}

  ${({ flip }) =>
    flip
      ? css`
          right: 0;

          transform: translate(calc(-100% - 0.25em), -50%) scale(0.95)
            rotate(180deg);

          &:hover {
            transform: translate(-100%, -50%) scale(1) rotate(180deg);
          }
        `
      : css`
          left: 0;

          transform: translate(0.25em, -50%) scale(0.95);

          &:hover {
            transform: translate(0, -50%) scale(1);
          }
        `}

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -1em;
    height: 200%;
    width: 15em;
    transform: translateY(-50%);

    pointer-events: none;

    z-index: -1;
    background: radial-gradient(circle at 0%, #00000096, transparent 55%);
  }

  &:hover {
    opacity: 1;
  }
`;

type NavProps = React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
} & ({ left: true } | { right: true });

// Safari 14 and less are broke af
// TODO: Remove once Safari 16 is released (~ September 2022)
const shitIsBroke =
  browser?.name === "safari" && +browser?.version.split(".")[0] <= 14;

export default function Nav(props: NavProps) {
  // Safari scrolling snap views is super messed up
  if (shitIsBroke || isTouchDevice()) return null;

  return (
    <Container flip={"right" in props} {...props}>
      <Button flip={"right" in props} visible={props.visible}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 8 14"
          preserveAspectRatio="none"
        >
          <path
            d="M7 1L1 7l6 6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </Container>
  );
}
