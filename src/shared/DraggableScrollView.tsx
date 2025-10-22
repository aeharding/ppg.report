import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface DraggableScrollViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container = styled.div<{ hasOverflow: boolean }>`
  ${({ hasOverflow }) =>
    hasOverflow &&
    css`
      cursor: grab;

      * {
        cursor: grab;
      }

      &:active {
        cursor: grabbing;

        * {
          cursor: grabbing;
        }
      }
    `}
`;

function DraggableScrollView({ children, ...rest }: DraggableScrollViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      setHasOverflow(container.scrollWidth > container.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [children]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (
        !container ||
        container.scrollWidth <= container.clientWidth ||
        !isDragging
      )
        return;

      const deltaX = event.clientX - dragStartX;
      container.scrollLeft = scrollLeftStart - deltaX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartX, scrollLeftStart]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container && container.scrollWidth > container.clientWidth) {
      setDragStartX(event.clientX);
      setScrollLeftStart(container.scrollLeft);
      setIsDragging(true);
    }
  };

  return (
    <Container
      ref={containerRef}
      hasOverflow={hasOverflow}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      {children}
    </Container>
  );
}

export default DraggableScrollView;
