import styled from "@emotion/styled";
import { useState } from "react";
import { DefinitionTooltipProps, definitionStyles } from "./Definition";
import linkifyHtml from "linkify-html";
import { linkifyOptions } from "../Discussion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/pro-light-svg-icons";

const Takeover = styled.div`
  position: fixed;
  inset: 0;
  top: 56px;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  padding: 1rem;

  backdrop-filter: blur(3px);

  z-index: 1;
`;

const ClickBlock = styled.div`
  position: fixed;
  inset: 0;
  top: 56px;
  z-index: 1;
`;

const Term = styled.h3`
  font-size: 2rem;
  font-weight: 100;
  margin: 0;
  flex-shrink: 0;
`;

const DefinitionText = styled.div`
  font-size: 0.9rem;
  min-height: 0;
  margin-bottom: 20vh;
`;

const Link = styled.a`
  position: absolute;
  bottom: env(safe-area-inset-bottom);
  right: 0;
  padding: 2rem;
`;

const DefinitionSpan = styled.a`
  && {
    ${() => definitionStyles}
  }
`;

export default function DefinitionDialog({
  term,
  definition,
  children,
}: DefinitionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clickBlock, setClickBlock] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setClickBlock(true);

    // Safari hacks on hacks on hacks on hacks
    setTimeout(() => {
      setClickBlock(false);
    }, 200);
  }
  return (
    <>
      <DefinitionSpan onClick={open}>{children}</DefinitionSpan>
      {isOpen && (
        <Takeover onTouchStart={close}>
          <Term>{term}</Term>
          <DefinitionText
            onTouchStart={(e) => {
              if (
                !e.target ||
                !(e.target instanceof HTMLElement) ||
                e.target.tagName !== "A"
              )
                return;

              e.stopPropagation();
            }}
            dangerouslySetInnerHTML={{
              __html: linkifyHtml(definition, {
                ...linkifyOptions,
              }),
            }}
          ></DefinitionText>

          <Link
            href={`https://forecast.weather.gov/glossary.php?word=${term}`}
            target="_blank"
            rel="noopener noreferrer"
            onTouchStart={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faExternalLink} />
          </Link>
        </Takeover>
      )}

      {clickBlock && (
        <ClickBlock
          onClick={() => {
            /* on hacks on hacks on hacks */
          }}
        />
      )}
    </>
  );
}
