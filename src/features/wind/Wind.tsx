import styled from "@emotion/styled/macro";
import { ReactComponent as WindSvg } from "./wind.svg";

const WindContainer = styled.div`
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    color: rgba(255, 255, 255, 0.1);
  }

  path {
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    animation: dash-wind 12s ease-in forwards infinite;

    ${() => {
      let styled = "";

      for (let i = 1; i <= 6; i++) {
        styled += `
          &:nth-of-type(${i}) {
            animation-delay: ${Math.random() * 2 + (i - 1) * 6}s;
          }
        `;
      }
      return styled;
    }}

    @keyframes dash-wind {
      0% {
        stroke-dashoffset: 800;
      }
      10% {
        stroke-dasharray: 400;
        stroke-dashoffset: 0;
      }
      20%,
      100% {
        stroke-dasharray: 800;
        stroke-dashoffset: -800;
      }
    }
  }
`;

export default function Wind() {
  return (
    <WindContainer>
      <WindSvg />
    </WindContainer>
  );
}
