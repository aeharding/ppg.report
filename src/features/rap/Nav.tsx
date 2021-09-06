import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { isTouchDevice } from "../../helpers/device";

const Container = styled.div<{ flip: boolean }>`
  position: absolute;
  top: 0;
  right: -1em;
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

const Svg = styled.svg<{ flip: boolean; visible: boolean }>`
  position: sticky;
  top: 50%;
  width: 5em;
  height: 10em;
  padding: 6em 6em 6em 1em;
  pointer-events: auto;

  ${({ flip }) =>
    flip
      ? css`
          right: 0;
          transform-origin: right center;

          transform: translate(calc(-100% - 0.25em), -50%) scale(0.95)
            rotate(180deg);

          &:hover {
            transform: translate(-100%, -50%) scale(1) rotate(180deg);
          }
        `
      : css`
          left: 0;
          transform-origin: left center;

          transform: translate(0.25em, -50%) scale(0.95);

          &:hover {
            transform: translate(0, -50%) scale(1);
          }
        `}

  z-index: 1;

  box-sizing: content-box;

  stroke-width: 0.3px;
  cursor: pointer;

  opacity: 0;

  transition: 100ms ease-out;
  transition-property: opacity, transform;

  background: radial-gradient(circle at 0%, black, transparent 65%);

  &:hover {
    opacity: 1;
  }
`;

type NavProps = { left: true } | { right: true };

export default function Nav(props: NavProps) {
  if (isTouchDevice()) return null;

  return (
    <Container flip={"right" in props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 8 14"
        preserveAspectRatio="none"
        flip={"right" in props}
        visible={true}
      >
        <path
          d="M7 1L1 7l6 6"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </Container>
  );
}
