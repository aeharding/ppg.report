import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { isInstalled } from "./helpers/device";
import { outputP3ColorFromRGB } from "./helpers/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-regular-svg-icons";

const FancyFooter = styled.footer`
  padding: 1em;
  text-align: center;
  color: var(--softText);

  width: 100vw;

  position: sticky;
  left: 0;
  right: 0;

  a:hover {
    color: var(--text);
  }
`;

const Warning = styled.span`
  ${outputP3ColorFromRGB([255, 255, 0])}
`;

export default function Footer() {
  const location = useLocation();

  if (location.pathname !== "/" && isInstalled()) return null;

  return (
    <FancyFooter>
      <a
        href="https://github.com/aeharding/ppg.report"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faStar} /> on Github
      </a>{" "}
      — <Link to="/terms">Terms &amp; Privacy</Link> —{" "}
      <Warning>⚠️ Warning! Fly at your own risk.</Warning>
    </FancyFooter>
  );
}
