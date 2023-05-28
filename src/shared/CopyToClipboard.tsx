import styled from "@emotion/styled";
import { offset, shift, useFloating } from "@floating-ui/react-dom";
import { useEffect, useState } from "react";
import { TooltipContainer } from "../features/rap/extra/discussion/definition/DefinitionTooltip";

const Container = styled.div`
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface CopyToClipboardProps {
  children: string;
}

export default function CopyToClipboard({ children }: CopyToClipboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [shift(), offset(5)],
  });

  async function onClick() {
    await navigator.clipboard.writeText(children);

    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <>
      <Container ref={refs.setReference} onClick={onClick}>
        {children}
      </Container>
      {isOpen && (
        <TooltipContainer ref={refs.setFloating} style={floatingStyles}>
          Copied to clipboard
        </TooltipContainer>
      )}
    </>
  );
}
