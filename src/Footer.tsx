import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { isInstalled } from "./helpers/device";
import { outputP3ColorFromRGB } from "./helpers/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-regular-svg-icons";
import pJson from "../package.json";
import { Trans, useTranslation } from "react-i18next";

const FancyFooter = styled.footer`
  padding: 1em;
  text-align: center;
  color: var(--softText);

  a:hover {
    color: var(--text);
  }
`;

const Warning = styled.span`
  ${outputP3ColorFromRGB([255, 255, 0])}
`;

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();

  if (location.pathname !== "/" && isInstalled()) return null;

  return (
    <FancyFooter>
      <a
        href={`https://github.com/aeharding/ppg.report/releases/tag/v${pJson.version}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        v{pJson.version}
      </a>{" "}
      —{" "}
      <a
        href="https://github.com/aeharding/ppg.report"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans i18nKey="Star on Github">
          <FontAwesomeIcon icon={faStar} /> on Github
        </Trans>
      </a>{" "}
      — <Link to="/terms">{t("Terms & Privacy")}</Link> —{" "}
      <Warning>⚠️ {t("Fly Warning")}</Warning>
    </FancyFooter>
  );
}
