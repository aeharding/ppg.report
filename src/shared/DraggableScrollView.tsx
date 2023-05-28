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

const DraggableScrollView: React.FC<DraggableScrollViewProps> = ({
  children,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container && container.scrollWidth > container.clientWidth) {
      setHasOverflow(true);
    } else {
      setHasOverflow(false);
    }
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container && container.scrollWidth > container.clientWidth) {
      setDragStartX(event.clientX);
      setScrollLeftStart(container.scrollLeft);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
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

  return (
    <Container
      ref={containerRef}
      hasOverflow={hasOverflow}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      {children}
    </Container>
  );
};

export default DraggableScrollView;
