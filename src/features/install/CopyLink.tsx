import styled from "@emotion/styled/macro";
import { faLink } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { outputP3ColorFromRGB } from "../../helpers/colors";

const CopyLinkButton = styled.div`
  color: black;
  text-align: center;
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 1rem;
  ${outputP3ColorFromRGB([0, 255, 0], "background-color")}
`;

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = new URL(window.location.href);
    url.searchParams.append("installApp", "1");

    await navigator.clipboard.writeText(url.href);
    setCopied(true);
  }

  return (
    <CopyLinkButton onClick={copy}>
      <FontAwesomeIcon icon={faLink} /> {copied ? <>Copied!</> : <>Copy link</>}
    </CopyLinkButton>
  );
}
