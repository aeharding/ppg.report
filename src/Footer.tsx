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
      Powered by{" "}
      <a
        href="https://rucsoundings.noaa.gov/"
        target="_blank"
        rel="noreferrer noopener"
      >
        NOAA
      </a>{" "}
      — <Link to="/terms">Terms</Link> —{" "}
      <Warning>⚠️ Warning! Fly at your own risk.</Warning>
    </FancyFooter>
  );
}
