import styled from "@emotion/styled/macro";
import Linkify from "linkify-react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import Loading from "../../../shared/Loading";
import { undoFixedWidthText } from "../../alerts/Alerts";

export const linkifyOptions = {
  nl2br: true,
  rel: "noopener noreferrer",
  target: "_blank",
  defaultProtocol: "https",
};

const StyledLinkify = styled(Linkify)`
  font-family: inherit;
  white-space: pre-line;
  margin: 0 1rem;
  line-height: 1.5;
`;

export default function Discussion() {
  const discussion = useAppSelector((state) => state.weather.discussion);

  switch (discussion) {
    case undefined:
    case "failed":
    case "not-available":
    case "pending":
      return <Loading />;
    default:
      return (
        <>
          {parseDiscussion(
            undoFixedWidthText(discussion.productText.trim())
          ).map((part, index) => {
            switch (typeof part) {
              case "string":
                return (
                  <StyledLinkify
                    key={index}
                    options={linkifyOptions}
                    tagName="div"
                  >
                    {part.trim()}
                  </StyledLinkify>
                );
              default:
                return (
                  <DiscussionPartContainer
                    header={part.header}
                    key={index}
                    issuingOffice={discussion.issuingOffice.slice(1)}
                  >
                    {part.body}
                  </DiscussionPartContainer>
                );
            }
          })}
        </>
      );
  }
}

interface DiscussionPart {
  header: string;
  body: string;
}

const headerRegex = /(\.(?:(?:[A-Z0-9]| |\/)+)\.{3})/;

function parseDiscussion(discussion: string): (string | DiscussionPart)[] {
  const splits = discussion.split(headerRegex);

  const result: (string | DiscussionPart)[] = [];

  while (splits.length) {
    const potentialHeader = splits.shift();

    if (!potentialHeader) continue;

    if (headerRegex.test(potentialHeader)) {
      const body = splits.shift();
      if (!body) continue;
      result.push({
        header: potentialHeader.slice(1, -3),
        body: body.trim().replace(/&&$/, "").trim(),
      });
    } else {
      // It's a section without a header instead
      result.push(potentialHeader);
    }
  }

  return result;
}

interface DiscussionPartContainerProps {
  header: string;
  children: React.ReactNode;
  issuingOffice: string;
}

function DiscussionPartContainer({
  header,
  children,
  issuingOffice,
}: DiscussionPartContainerProps) {
  const lowercaseHeader = header
    .toLowerCase()
    .replace(issuingOffice.toLowerCase(), issuingOffice.toUpperCase())
    .replace(/(^|\s|\/)([a-z])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });

  return (
    <div>
      <Header>{lowercaseHeader}</Header>
      <StyledLinkify tagName="div" options={linkifyOptions}>
        {children}
      </StyledLinkify>
    </div>
  );
}

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

function Header({ children }: HeaderProps) {
  const color = (() => {
    switch (children.toUpperCase()) {
      case "FIRE":
      case "FIRE WEATHER":
        return [255, 0, 0];
      case "SHORT TERM":
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
  return <H2 textColor={color as [number, number, number]}>{children}</H2>;
}
