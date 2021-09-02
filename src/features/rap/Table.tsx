import styled from "@emotion/styled/macro";
import Rap from "../../models/Rap";
import Hour from "./Hour";
import DragToScroll from "./DragToScroll";

const minHourWidth = 350;

const Hours = styled(DragToScroll)`
  display: flex;

  overflow: auto;
  min-height: 0;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255, 255, 255, 0);
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-thumb {
    border-left: 2px solid rgba(255, 255, 255, 0);
    border-right: 2px solid rgba(255, 255, 255, 0);
    border-top: 20px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
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

  margin: 0 -1em;
  padding: 0 1em;

  &:first-of-type {
    padding-left: 2em;
  }
  &:last-of-type {
    padding-right: 1em;

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
          width: calc(${100 / i}vw - ${1 + 3 / i}em);
        }
      `;
    }

    return css;
  }}
`;

interface TableProps {
  raps: Rap[];
}

export default function Table({ raps }: TableProps) {
  return (
    <Hours>
      {raps.map((rap) => (
        <HourContainer key={rap.date}>
          <StyledHour rap={rap} />
        </HourContainer>
      ))}
    </Hours>
  );
}
