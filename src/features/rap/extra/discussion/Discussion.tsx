import styled from "@emotion/styled";
import Linkify from "linkify-react";
import { useEffect, useState } from "react";
import { undoFixedWidthText } from "../../../../helpers/weather";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import Loading from "../../../../shared/Loading";
import { setDiscussionViewed } from "../../../weather/weatherSlice";
import * as storage from "../../../user/storage";
import { Opts } from "linkifyjs";
import { GlossaryTerm } from "../../../../services/nwsWeather";
import { getGlossary } from "../../../../services/nwsWeather";
import { generateGlossary } from "./definition/generateGlossary";
import DiscussionPart from "./DiscussionPart";

export const linkifyOptions: Opts = {
  nl2br: true,
  rel: "noopener noreferrer",
  target: "_blank",
  defaultProtocol: "https",
  ignoreTags: ["a"],
  validate: (value) => value.toLowerCase().indexOf("ppg.report") === -1,
};

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Overflow = styled.div`
  overflow: hidden;
  padding: 3rem 0;
  text-align: center;
`;

export const StyledLinkify = styled(Linkify)`
  font-family: inherit;
  white-space: pre-line;
  overflow-wrap: break-word;
  margin: 0 1rem;
  line-height: 1.5;

  a {
    text-decoration: underline;
    text-decoration-thickness: 0.5px;
  }
`;

export default function Discussion() {
  const discussion = useAppSelector((state) => state.weather.discussion);
  const dispatch = useAppDispatch();
  const [glossary, setGlossary] = useState<GlossaryTerm[] | undefined>();

  useEffect(() => {
    if (!discussion || typeof discussion !== "object") return;

    dispatch(setDiscussionViewed(discussion.issuanceTime));
    storage.setDiscussionViewed(
      discussion.issuingOffice,
      discussion.issuanceTime
    );
  }, [dispatch, discussion]);

  useEffect(() => {
    (async () => {
      setGlossary(await getGlossary());
    })();
  }, []);

  switch (discussion) {
    case undefined:
    case "failed":
      return <Overflow>Discussion failed to load. Try again later.</Overflow>;
    case "not-available":
      return (
        <Overflow>
          Discussion not currently available. Try again later.
        </Overflow>
      );
    case "pending":
      return (
        <Overflow>
          <Loading center={false} />
        </Overflow>
      );
    default:
      return (
        <Container>
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
                    {glossary
                      ? generateGlossary(part.trim(), glossary)
                      : part.trim()}
                  </StyledLinkify>
                );
              default:
                return (
                  <DiscussionPart
                    header={part.header}
                    key={index}
                    issuingOffice={discussion.issuingOffice.slice(1)}
                  >
                    {glossary
                      ? generateGlossary(part.body, glossary)
                      : part.body}
                  </DiscussionPart>
                );
            }
          })}
        </Container>
      );
  }
}

interface DiscussionPartResult {
  header: string;
  body: string;
}

const headerRegex = /(\n\.(?:[^\n.])+\.{3})/;

function parseDiscussion(
  discussion: string
): (string | DiscussionPartResult)[] {
  const splits = discussion.split(headerRegex);

  const result: (string | DiscussionPartResult)[] = [];

  while (splits.length) {
    const potentialHeader = splits.shift();

    if (!potentialHeader) continue;

    if (headerRegex.test(potentialHeader)) {
      const body = splits.shift();
      if (!body) continue;
      result.push({
        header: potentialHeader.trim().slice(1, -3),
        body: body.trim().replace(/&&$/, "").trim(),
      });
    } else {
      // It's a section without a header instead
      result.push(potentialHeader);
    }
  }

  return result;
}
