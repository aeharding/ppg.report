import styled from "@emotion/styled/macro";
import Glance from "./Glance";
import Greeting from "./Greeting";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 4rem;
  padding: 0 calc(1em + var(--right-safe-area)) 0
    calc(1em + var(--left-safe-area));
`;

export default function Summary() {
  return (
    <Container>
      <Greeting />
      <Glance />
    </Container>
  );
}
