import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";

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
