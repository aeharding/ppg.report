import styled from "@emotion/styled/macro";
import { detect } from "detect-browser";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Hour from "./Hour";
import ReportWatchdog from "./ReportWatchdog";
import Nav from "./Nav";
import roundedScrollbar from "./roundedScrollbar";
import { css } from "@emotion/react/macro";
import throttle from "lodash/throttle";
import { Rap } from "gsl-parser";
import ReportElevationDiscrepancy, {
  ELEVATION_DISCREPANCY_THRESHOLD,
} from "./warnings/ReportElevationDiscrepancy";
import Extra from "./extra/Extra";
import Scrubber from "./Scrubber";
import { isEqual, startOfHour } from "date-fns";
import ReportStale from "./warnings/ReportStale";
import Errors from "./Errors";
import { OnOff } from "../user/userSlice";
import { useAppSelector } from "../../hooks";

const browser = detect();

enum ScrollPosition {
  Beginning,
  Middle,
  End,
  None,
}

enum Direction {
  Forward,
  Back,
}

enum Distance {
  // Forward/back one step
  Hour,

  // Forward/back multiple steps
  Page,

  // Forward/back to end of list
  End,
}

const minHourWidth = 350;

const ScrollContainer = styled.div`
  position: relative;
  display: flex;

  flex: 1;
  justify-content: center;
`;

const Container = styled.div<{ swipeInertia: OnOff }>`
  --hours-gutter: 1.4em;

  @media (max-width: 360px) {
    --hours-gutter: 0.75em;
  }

  display: flex;

  overflow: auto;
  min-height: 0;

  scroll-snap-type: x mandatory;

  section {
    scroll-snap-stop: ${({ swipeInertia }) =>
      swipeInertia === OnOff.On ? "normal" : "always"};
  }

  ${browser?.os !== "Mac OS" &&
  css`
    @media (any-hover: hover) {
      ${roundedScrollbar}

      ::-webkit-scrollbar-track,
      ::-webkit-scrollbar-thumb {
        margin: 0 2em;
      }
    }
  `}
  @media (any-hover: none) {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.15);

  > * {
    flex-shrink: 0;
  }
`;

const HourContainer = styled.section`
  scroll-snap-align: start;

  margin: 0 calc(-1 * var(--right-safe-area)) var(--hours-gutter)
    calc(-1 * var(--left-safe-area));
  padding: 0 var(--right-safe-area) 0 var(--left-safe-area);

  &:first-of-type {
    padding-left: calc(2 * var(--left-safe-area));
  }
  &:last-of-type {
    padding-right: var(--right-safe-area);

    > div {
      margin-right: var(--hours-gutter);
    }
  }
`;

const StyledHour = styled(Hour)`
  margin-left: var(--hours-gutter);

  width: calc(100vw - calc(var(--hours-gutter) * 4));

  ${() => {
    let css = "";

    for (let i = 1; i <= 10; i++) {
      css += `
        @media (min-width: ${i * minHourWidth}px) {
          width: calc(${100 / i}vw - var(--hours-gutter) - calc(${
        1 / i
      } * var(--hours-gutter)) - calc(${
        1 / i
      } * var(--right-safe-area)) - calc(${1 / i} * var(--left-safe-area)));
        }
      `;
    }

    return css;
  }}
`;

const Footer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--right-safe-area) 0 var(--left-safe-area);

  color: var(--softText);
  font-size: 0.8em;
  text-align: right;

  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    text-align: center;
  }
`;

interface TableProps {
  rap: Rap[];
}

export default function Hours({ rap }: TableProps) {
  const elevation = useAppSelector((state) => state.weather.elevation);

  const swipeInertia = useAppSelector((state) => state.user.swipeInertia);

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(
    ScrollPosition.Beginning
  );

  if (elevation == null) throw new Error("Elevation not found");

  const lowestReportedAltitude = rap[0].data[0].height;

  // Each report can have a different # of rows. This normalizes that
  const rows = rap[0].data.filter(({ height }) => height < 5800).length;

  const data = useMemo(
    () =>
      rap.map((rap) => (
        <HourContainer key={rap.date}>
          <StyledHour
            rap={rap}
            rows={rows}
            surfaceLevelMode={
              Math.abs(elevation - lowestReportedAltitude) <
              ELEVATION_DISCREPANCY_THRESHOLD
            }
          />
        </HourContainer>
      )),
    [rap, rows, elevation, lowestReportedAltitude]
  );

  useEffect(() => {
    // Safari 14 and less are broke af
    // TODO: Remove once Safari 16 is released (~ September 2022)
    if (browser?.name === "safari" && +browser?.version.split(".")[0] <= 14)
      return;

    onScroll();

    const callback = (e: KeyboardEvent) => {
      if (!scrollViewRef.current) return;

      let distance = Distance.Hour;
      if (e.metaKey) distance = Distance.End;
      if (e.altKey) distance = Distance.Page;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          scroll(Direction.Back, distance);
          break;
        case "ArrowRight":
          e.preventDefault();
          scroll(Direction.Forward, distance);
          break;
        case "End":
          e.preventDefault();
          scroll(Direction.Forward, Distance.End);
          break;
        case "Home":
          e.preventDefault();
          scroll(Direction.Back, Distance.End);
          break;
        case "PageDown":
          e.preventDefault();
          scroll(Direction.Forward, Distance.Page);
          break;
        case "PageUp":
          e.preventDefault();
          scroll(Direction.Back, Distance.Page);
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = throttle(() => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    let position: ScrollPosition = ScrollPosition.Middle;
    if (scrollView.scrollWidth <= scrollView.clientWidth + 5) {
      position = ScrollPosition.None;
    } else if (scrollView.scrollLeft <= 200) {
      position = ScrollPosition.Beginning;
    } else if (
      scrollView.scrollLeft >=
      scrollView.scrollWidth - scrollView?.clientWidth - 200
    ) {
      position = ScrollPosition.End;
    }
    setScrollPosition(position);
  }, 250);

  // Focus current time of day when opening the report
  useLayoutEffect(() => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    const index = rap.findIndex((rapLine) =>
      isEqual(new Date(rapLine.date), startOfHour(new Date()))
    );

    if (index === -1 || scrollView.scrollLeft) return;

    scrollView.scrollTo({
      left:
        scrollView.querySelectorAll("section")[index].offsetLeft -
        scrollView.offsetLeft,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    onScroll();

    scrollView.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      scrollView.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollViewRef]);

  function scroll(direction: Direction, distance = Distance.Hour) {
    if (!scrollViewRef.current) throw new Error("Scrollview not found");

    switch (distance) {
      case Distance.Hour: {
        const section = scrollViewRef.current.querySelector("section");

        if (!section) throw new Error("Section not found");

        switch (direction) {
          case Direction.Back: {
            scrollViewRef.current.scrollBy(-(section.clientWidth / 2), 0);
            break;
          }
          case Direction.Forward: {
            scrollViewRef.current.scrollBy(section.clientWidth / 2, 0);
          }
        }
        break;
      }
      case Distance.End: {
        switch (direction) {
          case Direction.Back:
            scrollViewRef.current.scrollLeft = 0;
            break;
          case Direction.Forward:
            scrollViewRef.current.scrollLeft =
              scrollViewRef.current.scrollWidth;
        }
        break;
      }
      case Distance.Page: {
        // TODO - skip to sunset/sunrise?

        // If I go exactly to clientWidth, the browser snap
        //  overshoots by 1 in Safari
        const HACKY_OFFSET = 100;

        switch (direction) {
          case Direction.Back: {
            scrollViewRef.current.scrollBy(
              -scrollViewRef.current.clientWidth + HACKY_OFFSET,
              0
            );
            break;
          }
          case Direction.Forward: {
            scrollViewRef.current.scrollBy(
              scrollViewRef.current.clientWidth - HACKY_OFFSET,
              0
            );
          }
        }
        break;
      }
    }
  }

  return (
    <>
      <ReportElevationDiscrepancy />
      <ReportStale />

      <Scrubber scrollViewRef={scrollViewRef}>
        <Container ref={scrollViewRef} swipeInertia={swipeInertia}>
          <ScrollContainer>
            {scrollPosition !== ScrollPosition.None && (
              <Nav
                left
                visible={scrollPosition !== ScrollPosition.Beginning}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => scroll(Direction.Back)}
              />
            )}
            {data}
            {scrollPosition !== ScrollPosition.None && (
              <Nav
                right
                visible={scrollPosition !== ScrollPosition.End}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => scroll(Direction.Forward)}
              />
            )}
          </ScrollContainer>
        </Container>
      </Scrubber>

      <Footer>
        <Errors />

        <Extra />

        <ReportWatchdog rap={rap} />
      </Footer>
    </>
  );
}
