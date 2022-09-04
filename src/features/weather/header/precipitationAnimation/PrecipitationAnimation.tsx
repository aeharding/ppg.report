import { keyframes } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import snow1 from "./snow1.png";
import snow2 from "./snow2.png";
import snow3 from "./snow3.png";

const animation = keyframes` 
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }
  100% {
    background-position: 500px 1000px, 400px 400px, 300px 300px;
  }
`;

export default styled.div<{ chance: number; isSnow: boolean }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-image: ${({ chance }) =>
    chance > 0.75
      ? `url(${snow1}), url(${snow2}), url(${snow3})`
      : `url(${snow1})`};
  background-size: ${({ isSnow }) => (isSnow ? "400px" : "150px")};
  opacity: ${({ chance }) => (chance * 2 - 0.6) * 0.8};
  z-index: -1;

  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  animation: ${animation} ${({ chance }) => (chance > 0.75 ? "8s" : "12s")}
    linear infinite;
  animation-delay: -${() => Math.random() * 5}s;

  @media (prefers-reduced-motion) {
    display: none;
  }
`;
