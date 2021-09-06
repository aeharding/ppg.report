import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { useEffect, useRef, useState } from "react";
import { isTouchDevice } from "../../helpers/device";

const Svg = styled.svg<{ flip: boolean; visible: boolean }>`
  position: fixed;
  top: 50%;
  width: 5em;
  height: 10em;
  padding: 6em 6em 6em 1em;

  pointer-events: none;

  ${({ flip, visible }) =>
    flip
      ? css`
          right: 0;
          transform-origin: right center;

          transform: translate(calc(-100% + 0.25em), -50%) scale(0.95)
            rotate(180deg);

          ${visible &&
          css`
            transform: translate(-100%, -50%) scale(1) rotate(180deg);
          `}
        `
      : css`
          left: 0;
          transform-origin: left center;

          transform: translate(0.25em, -50%) scale(0.95);

          ${visible &&
          css`
            transform: translate(0, -50%) scale(1);
          `}
        `}

  z-index: 1;

  box-sizing: content-box;

  stroke-width: 0.3px;
  cursor: pointer;

  opacity: 0;

  transition: 100ms ease-out;
  transition-property: opacity, transform;

  background: radial-gradient(circle at 0%, black, transparent 65%);

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
    `}
`;

type NavProps = { left: true } | { right: true };

export default function Nav(props: NavProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current?.parentElement) return;

    const { left, top, width, height } =
      ref.current.parentElement.getBoundingClientRect();

    const onMouseMove = ({ pageX, pageY }: MouseEvent) => {
      if (pageY < top + height * 0.35 || pageY > top + height * 0.65) {
        setVisible(false);
        return;
      } else if (pageX < left + width * 0.15 || pageX > left + width * 0.85) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = visible ? "pointer" : "";

    return () => {
      document.body.style.removeProperty("cursor");
    };
  }, [visible]);

  if (isTouchDevice()) return null;

  return (
    <Svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8 14"
      preserveAspectRatio="none"
      flip={"right" in props}
      visible={visible}
    >
      <path
        d="M7 1L1 7l6 6"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
