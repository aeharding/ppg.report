import styled from "@emotion/styled/macro";
import { ReactComponent as Icon } from "./icon.svg";

const LogoContainer = styled.span`
  display: flex;

  color: rgba(255, 255, 255, 0.8);

  svg {
    width: 1.5em;
    transform: scaleX(-1);
    margin-right: 0.6em;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  display: flex;
  margin: 0;
`;

const Aside = styled.aside`
  opacity: 0.8;
`;

export default function Logo() {
  return (
    <LogoContainer>
      <Text>
        <Title>
          <Icon />
          PPG.report
        </Title>
        <Aside>Wind report for Paramotorists</Aside>
      </Text>
    </LogoContainer>
  );
}
