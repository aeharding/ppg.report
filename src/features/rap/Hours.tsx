import styled from "@emotion/styled/macro";
import { detect } from "detect-browser";
import { useEffect, useRef } from "react";
import Hour from "./Hour";
import { RapPayload } from "./rapSlice";
import ReportWatchdog from "./ReportWatchdog";
import Nav from "./Nav";

const browser = detect();

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
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255, 255, 255, 0);
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-thumb {
    border-left: 2px solid rgba(255, 255, 255, 0);
    border-right: 2px solid rgba(255, 255, 255, 0);
    border-top: 0px solid rgba(255, 255, 255, 0);
    border-bottom: 12px solid rgba(255, 255, 255, 0);
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

const HourContainer = styled.div`
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
  const ref = useRef<HTMLDivElement>(null);

  // Each report can have a different # of rows. This normalizes that
  const rows = rap.data[0].data.filter(({ height }) => height < 5800).length;

  useEffect(() => {
    // Safari behaves strangely
    if (browser?.name === "safari") return;

    let last = 0;
    let timestamp = 0;

    const callback = (e: KeyboardEvent) => {
      if (!ref.current) return;

      switch (e.key) {
        case "ArrowLeft": {
          e.preventDefault();
          const prev =
            Date.now() - timestamp < 1000 ? last : ref.current.scrollLeft;
          ref.current.scrollLeft = prev - ref.current.children[0].clientWidth;
          last = ref.current.scrollLeft - ref.current.children[0].clientWidth;
          timestamp = Date.now();
          return;
        }
        case "ArrowRight": {
          e.preventDefault();
          const prev =
            Date.now() - timestamp < 1000 ? last : ref.current.scrollLeft;
          ref.current.scrollLeft = prev + ref.current.children[0].clientWidth;
          last = ref.current.scrollLeft + ref.current.children[0].clientWidth;
          timestamp = Date.now();
        }
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  });

  return (
    <>
      <Container ref={ref}>
        <ScrollContainer>
          <Nav left />
          {rap.data.map((rap) => (
            <HourContainer key={rap.date}>
              <StyledHour rap={rap} rows={rows} />
            </HourContainer>
          ))}
          <Nav right />
        </ScrollContainer>
      </Container>

      <ReportWatchdog rap={rap} />
    </>
  );
}
