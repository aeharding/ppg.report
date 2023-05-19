import { detect } from "detect-browser";
import { isTouchDevice } from "../../../../../helpers/device";
import DefinitionDialog from "./DefinitionDialog";
import DefinitionTooltip from "./DefinitionTooltip";
import { css, keyframes } from "@emotion/react";

const browser = detect();

const touchDevice = isTouchDevice();

const definitionUnderlineColorFadeIn = keyframes`
  from {
    text-decoration-color: transparent;
  }

  to {
    text-decoration-color: rgba(0, 157, 255, 0.7);
  }
`;

export const definitionStyles = css`
  text-decoration: underline;
  text-decoration-style: wavy;
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
      case "ios":
      case "ios-webview":
      case "edge-ios":
        return css`
          text-decoration-thickness: 1.4px;
        `;
    }
  })()}

  animation: ${definitionUnderlineColorFadeIn} 500ms ease-out;
  animation-fill-mode: forwards;
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
