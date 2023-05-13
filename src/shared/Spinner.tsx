import styled from "@emotion/styled";

export default styled.div`
  color: rgba(255, 255, 255, 0.5);

  &::after {
    content: "";
    display: block;
    width: 1em;
    height: 1em;
    border-radius: 50%;

    border-top: 2px solid;
    border-left: 2px solid;
    border-bottom: 2px solid;
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;
