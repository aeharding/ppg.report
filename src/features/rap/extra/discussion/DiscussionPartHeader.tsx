import styled from "@emotion/styled";
import { outputP3ColorFromRGB } from "../../../../helpers/colors";

const H2 = styled.h2<{ textColor: [number, number, number] }>`
  position: sticky;
  top: 0;
  background: #111317;
  font-size: 1.1em;
  font-weight: 800;
  margin: 0;
  padding: 1rem 1rem 0;
  margin-top: 0.5rem;

  ${({ textColor }) => outputP3ColorFromRGB(textColor)};

  aside {
    display: inline;
    font-size: 0.75em;
    font-weight: normal;
    text-transform: capitalize;
  }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background: linear-gradient(
      180deg,
      transparent,
      transparent,
      ${({ textColor }) =>
        `rgb(${textColor[0]},${textColor[1]},${textColor[2]})`}
    );
  }

  &:after {
    content: "";
    display: block;
    margin-top: 1rem;
    margin: 0.5rem -1rem 1rem;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
  }
`;

interface HeaderProps {
  children: string;
}

// Matches "Near Term /Through Tonight/"
// or "Near Term [Through Tonight]"
// or "Near Term (Through Tonight)"
const asideRegex = /(\/|\[|\().*(\/|\]|\))$/;

export default function DiscussionPartHeader({ children }: HeaderProps) {
  const color = (() => {
    switch (children.toUpperCase().trim().replace(asideRegex, "").trim()) {
      case "FIRE":
      case "FIRE WEATHER":
        return [255, 0, 0];
      case "SHORT TERM":
      case "NEAR TERM":
        return [255, 255, 0];
      case "LONG TERM":
        return [255, 215, 0];
      case "AVIATION":
        return [0, 187, 255];
      case "MARINE":
        return [0, 0, 255];
      case "UPDATE":
      case "OUTLOOK":
      case "OVERVIEW":
      case "SYNOPSIS":
        return [0, 255, 0];
      case "DISCUSSION":
        return [255, 100, 300];

      default:
        return [255, 255, 255];
    }
  })();

  const mainText = children.trim().replace(asideRegex, "").trim();
  const asideText = children
    .trim()
    .match(asideRegex)?.[0]
    ?.trim()
    ?.slice(1, -1)
    .toLocaleLowerCase();
  return (
    <H2 textColor={color as [number, number, number]}>
      {mainText} {asideText && <aside>({asideText})</aside>}
    </H2>
  );
}
