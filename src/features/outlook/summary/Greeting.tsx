import styled from "@emotion/styled/macro";

const Container = styled.div`
  font-size: 3em;
  font-weight: 100;
`;

export default function Greeting() {
  const hours = new Date().getHours();
  let greeting: string;

  if (hours < 12) {
    greeting = "Good morning.";
  } else if (hours < 18) {
    greeting = "Good afternoon.";
  } else {
    greeting = "Good evening.";
  }

  return <Container>{greeting}</Container>;
}
