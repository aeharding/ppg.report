import { useEffect, useState } from "react";
import {
  flip,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStatus,
} from "@floating-ui/react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { FloatingPortal } from "@floating-ui/react";

export const TooltipContainer = styled.div<{ interactive: boolean }>`
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

  transition-property: opacity;

  ${({ interactive }) =>
    !interactive &&
    css`
      pointer-events: none;
    `}

  &[data-status="open"],
  &[data-status="close"] {
    transition-duration: 250ms;
  }
  &[data-status="initial"],
  &[data-status="close"] {
    opacity: 0;
  }
`;

interface TooltipProps {
  children?: React.ReactNode;
  contents: () => React.ReactNode;
  mouseOnly?: boolean;
  interactive?: boolean;
}

export default function Tooltip({
  children,
  contents,
  mouseOnly,
  interactive,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [delayedMounted, setDelayedMounted] = useState(isOpen);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift(), offset(5), flip()],
  });
  const { isMounted, status } = useTransitionStatus(context);

  const hover = useHover(context, {
    delay: {
      open: 100,
      close: 50,
    },
    mouseOnly,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  useEffect(() => {
    if (isMounted) {
      setDelayedMounted(isMounted);
      return;
    }

    // Hack to prohibit the class from being immediately removed
    setTimeout(() => {
      setDelayedMounted(isMounted);
    });
  }, [isMounted]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={delayedMounted ? "tooltip" : undefined}
      >
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <TooltipContainer
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            data-status={status}
            className="tooltip" /* Class used by <Scrubber /> to determine if tooltip is open */
            interactive={interactive ?? false}
          >
            {contents()}
          </TooltipContainer>
        </FloatingPortal>
      )}
    </>
  );
}
