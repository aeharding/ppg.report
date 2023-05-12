import { css, SerializedStyles } from "@emotion/react";

export function writeVariables(): SerializedStyles {
  return css`
    --bg-gradient-from: #0e0e0e;
    --bg-gradient-to: #001931;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --text: #eee;
    --softText: rgba(255, 255, 255, 0.3);
    --overscroll-background: #111;

    --edge-padding: 1rem;

    @media (max-width: 360px) {
      --edge-padding: 0.75em;
    }

    --left-safe-area: max(var(--edge-padding), env(safe-area-inset-left));
    --right-safe-area: max(var(--edge-padding), env(safe-area-inset-right));
  `;
}
