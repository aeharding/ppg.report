import { useState } from "react";
import {
  flip,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import styled from "@emotion/styled";

export const TooltipContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  width: max-content;
  max-width: 250px;

  background: black;
  font-size: 0.8em;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  white-space: normal;
`;

interface TooltipProps {
  children?: React.ReactNode;
  contents: () => React.ReactNode;
}

export default function Tooltip({ children, contents }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift(), offset(5), flip()],
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
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <TooltipContainer
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {contents()}
        </TooltipContainer>
      )}
    </>
  );
}
