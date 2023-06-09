import styled from "@emotion/styled";
import Icon from "../Icon";

const Container = styled.div`
  margin: auto;

  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  height: 25px;

  transform: translateY(-1px) scaleX(-1);
`;

const Title = styled.h1`
  margin: 0 0 0 0.6em;
  font-size: 1.5em;
`;

export default function HomeHeader() {
  return (
    <Container>
      <StyledIcon /> <Title>PPG.report</Title>
    </Container>
  );
}
