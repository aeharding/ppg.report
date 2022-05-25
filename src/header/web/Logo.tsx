import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { useLocation } from "react-router-dom";
import { ReactComponent as Icon } from "../icon.svg";

const LogoContainer = styled.span`
  display: flex;
  align-items: center;
  height: 70px;

  color: var(--text);

  svg {
    width: 2.5rem;
    height: 2rem;
    transform: scaleX(-1);
    margin-right: 0.6em;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1<{ compact?: boolean }>`
  display: flex;
  align-items: center;
  margin: 0;

  ${({ compact }) =>
    compact &&
    css`
      font-size: 1.3rem;
    `}
`;

const Aside = styled.aside`
  opacity: 0.8;
`;

export default function Logo() {
  const location = useLocation();

  return (
    <LogoContainer>
      <Text>
        <Title compact={location.pathname !== "/"}>
          <Icon />
          PPG.report
        </Title>
        {location.pathname === "/" ? (
          <Aside>Weather report for Paramotor Pilots</Aside>
        ) : (
          ""
        )}
      </Text>
    </LogoContainer>
  );
}
