import styled from "@emotion/styled/macro";
import Linkify from "linkify-react";
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
  margin: 0 0.5rem;
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
                    {part}
                  </StyledLinkify>
                );
              default:
                return (
                  <DiscussionPartContainer header={part.header} key={index}>
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
}

function DiscussionPartContainer({
  header,
  children,
}: DiscussionPartContainerProps) {
  return (
    <div>
      <Header>{header}</Header>
      <StyledLinkify tagName="div" options={linkifyOptions}>
        {children}
      </StyledLinkify>
    </div>
  );
}

const H2 = styled.h2<{ color: string }>`
  position: sticky;
  top: 0;
  background: #111317;
  font-size: 1.1em;
  font-weight: 300;
  margin: 0;
  padding: 1rem 0.5rem 0;

  color: ${({ color }) => color};

  &:after {
    content: "";
    display: block;
    margin-top: 1rem;
    margin: 1rem -0.5rem;
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
    switch (children) {
      case "FIRE":
      case "FIRE WEATHER":
        return "red";
      case "SHORT TERM":
        return "yellow";
      case "LONG TERM":
        return "orange";
      case "AVIATION":
        return "#00bbff";
      case "MARINE":
        return "#0800ed";

      default:
        return "white";
    }
  })();
  return <H2 color={color}>{children}</H2>;
}
