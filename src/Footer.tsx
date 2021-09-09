import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { isInstalled } from "./helpers/device";

const FancyFooter = styled.footer`
  padding: 1em;
  text-align: center;
  color: var(--softText);

  a:hover {
    color: var(--text);
  }
`;

const Warning = styled.span`
  color: yellow;
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
        ⭐️ on Github
      </a>{" "}
      — <Link to="/terms">Terms &amp; Privacy</Link> —{" "}
      <Warning>⚠️ Warning! Fly at your own risk.</Warning>
    </FancyFooter>
  );
}
