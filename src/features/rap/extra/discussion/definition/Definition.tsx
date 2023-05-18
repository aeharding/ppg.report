import { detect } from "detect-browser";
import { isTouchDevice } from "../../../../../helpers/device";
import DefinitionDialog from "./DefinitionDialog";
import DefinitionTooltip from "./DefinitionTooltip";
import { css } from "@emotion/react";

const browser = detect();

const touchDevice = isTouchDevice();

export const definitionStyles = css`
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: rgba(0, 157, 255, 0.7);
  text-decoration-skip-ink: none;
  text-underline-offset: 0.25em;

  ${(() => {
    switch (browser?.name) {
      case "chrome":
      case "chromium-webview":
        return css`
          text-decoration-thickness: 0.8px;
        `;
      case "safari":
        return css`
          text-decoration-thickness: 1px;
        `;
    }
  })()}
`;

export interface DefinitionTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function Definition(props: DefinitionTooltipProps) {
  if (touchDevice) return <DefinitionDialog {...props} />;

  return <DefinitionTooltip {...props} />;
}
