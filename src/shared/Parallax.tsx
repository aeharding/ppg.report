import React, { useEffect, useRef } from "react";
import { getScrollParent } from "../helpers/dom";
import styled from "@emotion/styled";

interface ParallaxProps {
  speed?: number;
  children?: React.ReactNode;
}

const Container = styled.div`
  position: relative;
`;

export default function Parallax({ speed = 0.5, children }: ParallaxProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const parallaxElement = parallaxRef.current;
      if (!parallaxElement) return;

      const scrollParent = scrollParentRef.current;
      if (!scrollParent) return;

      const scrollOffset =
        scrollParent.scrollTop < 0 ? 0 : scrollParent.scrollTop * speed;

      parallaxElement.style.transform = `translateY(${scrollOffset}px)`;
    };

    const scrollParent = getScrollParent(parallaxRef.current || undefined);

    if (scrollParent) {
      scrollParentRef.current = scrollParent;
      scrollParent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (!scrollParentRef.current) return;

      scrollParentRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return <Container ref={parallaxRef}>{children}</Container>;
}
