import styled from "@emotion/styled";
import { ReactComponent as Icon } from "../icon.svg";
import { useTranslation } from "react-i18next";

const LogoContainer = styled.span`
  display: flex;

  color: var(--text);

  svg {
    width: 1.5em;
    height: 1em;
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
  align-items: center;
  margin: 0;
`;

const Aside = styled.aside`
  opacity: 0.8;
`;

export default function Logo() {
  const { t } = useTranslation();

  return (
    <LogoContainer>
      <Text>
        <Title>
          <Icon />
          PPG.report
        </Title>
        <Aside>{t("Weather report for Paramotor Pilots")}</Aside>
      </Text>
    </LogoContainer>
  );
}
