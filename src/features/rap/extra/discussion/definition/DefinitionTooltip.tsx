import { DefinitionTooltipProps, definitionStyles } from "./Definition";
import styled from "@emotion/styled";
import Tooltip from "../../../../../shared/Tooltip";

export const TooltipContainer = styled.div`
  z-index: 1000;
  background: black;
  font-size: 0.8em;
  max-width: 450px;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  white-space: normal;
`;

const DefinitionLink = styled.a`
  && {
    ${() => definitionStyles}
  }
`;

export default function DefinitionTooltip({
  term,
  definition,
  children,
}: DefinitionTooltipProps) {
  const href = `https://forecast.weather.gov/glossary.php?word=${term}`;

  return (
    <Tooltip
      inline
      contents={() => <div dangerouslySetInnerHTML={{ __html: definition }} />}
    >
      <DefinitionLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          window.open(
            href,
            "noaaDefinitions",
            "toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=540,height=540",
          );
          e.preventDefault();
        }}
      >
        {children}
      </DefinitionLink>
    </Tooltip>
  );
}
