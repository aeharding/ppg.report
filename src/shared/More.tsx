import styled from "@emotion/styled";
import React, { useState } from "react";
import { outputP3ColorFromRGB } from "../helpers/colors";

const Container = styled.p``;

const Expand = styled.span`
  ${outputP3ColorFromRGB([0, 150, 255])}

  font-style: normal;
  cursor: pointer;
`;

interface MoreProps {
  children: React.ReactNode;
}

const CUTOFF = 200;

export default function More({ children }: MoreProps) {
  const text = getNodeText(children) || "";

  const [expanded, setExpanded] = useState(false);

  if (expanded) return <>{children}</>;

  return (
    <Container onClick={() => setExpanded(true)}>
      {text.slice(0, CUTOFF)}... <Expand>(more)</Expand>
    </Container>
  );
}

function getNodeText(node: React.ReactNode): string | undefined {
  if (["string", "number"].includes(typeof node)) return node as string;
  if (node instanceof Array) return node.map(getNodeText).join(" ");
  if (typeof node === "object" && node)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getNodeText((node as any).props.children);
}
