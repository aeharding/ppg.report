import { useState } from "react";
import { DefinitionTooltipProps, definitionStyles } from "./Definition";
import {
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import styled from "@emotion/styled";

const DefinitionTooltipContainer = styled.div`
  z-index: 1000;
  background: black;
  font-size: 0.8em;
  max-width: 450px;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
`;

const DefinitionLink = styled.a`
  && {
    ${() => definitionStyles}
  }
`;

export default function DefinitionTooltip({
  term,
  definition,
  children,
}: DefinitionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift(), offset(5)],
  });

  const hover = useHover(context, {
    delay: {
      open: 100,
      close: 0,
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <DefinitionLink
        ref={refs.setReference}
        {...getReferenceProps()}
        href={`https://forecast.weather.gov/glossary.php?word=${term}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </DefinitionLink>
      {isOpen && (
        <DefinitionTooltipContainer
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          dangerouslySetInnerHTML={{ __html: definition }}
        />
      )}
    </>
  );
}
