import styled from "@emotion/styled/macro";
import { detect } from "detect-browser";
import { useEffect, useMemo, useRef, useState } from "react";
import Hour from "./Hour";
import { RapPayload } from "./rapSlice";
import ReportWatchdog from "./ReportWatchdog";
import Nav from "./Nav";

const browser = detect();

enum ScrollPosition {
  Beginning,
  Middle,
  End,
}

enum Direction {
  Forward,
  Back,
}

const minHourWidth = 350;

const ScrollContainer = styled.div`
  position: relative;
  display: flex;
`;

const Container = styled.div`
  display: flex;

  overflow: auto;
  min-height: 0;

  scroll-snap-type: x mandatory;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255, 255, 255, 0);
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-thumb {
    border-left: 2px solid rgba(255, 255, 255, 0);
    border-right: 2px solid rgba(255, 255, 255, 0);
    border-top: 0px solid rgba(255, 255, 255, 0);
    border-bottom: 4px solid rgba(255, 255, 255, 0);
    background-clip: padding-box;
    margin: 0 2em;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  > * {
    flex-shrink: 0;
  }
`;

const HourContainer = styled.section`
  scroll-snap-align: start;

  margin: 0 calc(-1 * var(--right-safe-area)) 1em
    calc(-1 * var(--left-safe-area));
  padding: 0 var(--right-safe-area) 0 var(--left-safe-area);

  &:first-of-type {
    padding-left: calc(2 * var(--left-safe-area));
  }
  &:last-of-type {
    padding-right: var(--right-safe-area);

    > div {
      margin-right: 1em;
    }
  }
`;

const StyledHour = styled(Hour)`
  margin-left: 1em;

  width: calc(100vw - 4em);

  ${() => {
    let css = "";

    for (let i = 1; i <= 10; i++) {
      css += `
        @media (min-width: ${i * minHourWidth}px) {
          width: calc(${100 / i}vw - ${1 + 1 / i}em - calc(${
        1 / i
      } * var(--right-safe-area)) - calc(${1 / i} * var(--left-safe-area)));
        }
      `;
    }

    return css;
  }}
`;

interface TableProps {
  rap: RapPayload;
}

export default function Hours({ rap }: TableProps) {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(
    ScrollPosition.Beginning
  );

  // Each report can have a different # of rows. This normalizes that
  const rows = rap.data[0].data.filter(({ height }) => height < 5800).length;

  useEffect(() => {
    // Safari behaves strangely
    if (browser?.name === "safari") return;

    onScroll();

    const callback = (e: KeyboardEvent) => {
      if (!scrollViewRef.current) return;

      switch (e.key) {
        case "ArrowLeft": {
          e.preventDefault();
          scroll(Direction.Back);
          return;
        }
        case "ArrowRight": {
          e.preventDefault();
          scroll(Direction.Forward);
        }
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);

  function onScroll() {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    let position: ScrollPosition = ScrollPosition.Middle;
    if (scrollView.scrollLeft <= 200) {
      position = ScrollPosition.Beginning;
    } else if (
      scrollView.scrollLeft >=
      scrollView.scrollWidth - scrollView?.clientWidth - 200
    ) {
      position = ScrollPosition.End;
    }
    setScrollPosition(position);
  }

  useEffect(() => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    onScroll();

    scrollView.addEventListener("scroll", onScroll);
    return () => scrollView.removeEventListener("scroll", onScroll);
  }, [scrollViewRef]);

  const data = useMemo(
    () =>
      rap.data.map((rap) => (
        <HourContainer key={rap.date}>
          <StyledHour rap={rap} rows={rows} />
        </HourContainer>
      )),
    [rap, rows]
  );

  function scroll(direction: Direction) {
    if (!scrollViewRef.current) throw new Error("Scrollview not found");

    const section = scrollViewRef.current.querySelector("section");

    if (!section) throw new Error("Section not found");

    switch (direction) {
      case Direction.Back: {
        scrollViewRef.current.scrollBy(-section.clientWidth, 0);
        return;
      }
      case Direction.Forward: {
        scrollViewRef.current.scrollBy(section.clientWidth, 0);
      }
    }
  }

  return (
    <>
      <Container ref={scrollViewRef}>
        <ScrollContainer>
          <Nav
            left
            visible={scrollPosition !== ScrollPosition.Beginning}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => scroll(Direction.Back)}
          />
          {data}
          <Nav
            right
            visible={scrollPosition !== ScrollPosition.End}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => scroll(Direction.Forward)}
          />
        </ScrollContainer>
      </Container>

      <ReportWatchdog rap={rap} />
    </>
  );
}
