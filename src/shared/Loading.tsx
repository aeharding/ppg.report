import styled from "@emotion/styled/macro";
import { keyframes } from "@emotion/css/macro";

const Container = styled.div`
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 20vh;

  @media (max-height: 500px) {
    margin-top: 0;
    flex: 1;
  }

  &:after {
    content: "loading";

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 1.2em;
    font-weight: 100;
  }
`;

const Outline = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const LineMask = styled.div`
  position: absolute;
  overflow: hidden;

  width: 50%;
  height: 100%;
  transform-origin: 100%;
  -webkit-mask-image: -webkit-linear-gradient(top, #000000, rgba(0, 0, 0, 0));
  mask-image: linear-gradient(top, #000000, rgba(0, 0, 0, 0));
  animation: ${rotate} 1.2s infinite linear;
`;

const Line = styled.div`
  position: absolute;
  width: 200%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
`;

export default function Loading() {
  return (
    <Container>
      <Outline>
        <LineMask>
          <Line />
        </LineMask>
      </Outline>
    </Container>
  );
}
