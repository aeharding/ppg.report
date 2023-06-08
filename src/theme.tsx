import { css, SerializedStyles } from "@emotion/react";

export type ThemeMode = "light" | "dark";

export function writeVariables(mode: ThemeMode = "light"): SerializedStyles {
  switch (mode) {
    case "dark":
      return css`
        --bg-gradient-from: #0e0e0e;
        --bg-gradient-to: #001931;
        --hover-bg: rgba(255, 255, 255, 0.1);
        --text: #eee;
        --softText: rgba(255, 255, 255, 0.3);
        --overscroll-background: #111;
        --bg-bottom-sheet: #111317;
        --card-box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);

        --edge-padding: 1rem;

        @media (max-width: 360px) {
          --edge-padding: 0.75em;
        }

        --left-safe-area: max(var(--edge-padding), env(safe-area-inset-left));
        --right-safe-area: max(var(--edge-padding), env(safe-area-inset-right));
      `;

    case "light":
      return css`
        --bg-gradient-from: #ffffff;
        --bg-gradient-to: #ffffff;
        --hover-bg: rgba(255, 255, 255, 0.1);
        --text: #000000;
        --softText: rgba(255, 255, 255, 0.3);
        --overscroll-background: #111;
        --bg-bottom-sheet: #ffffff;
        --card-box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);

        --edge-padding: 1rem;

        @media (max-width: 360px) {
          --edge-padding: 0.75em;
        }

        --left-safe-area: max(var(--edge-padding), env(safe-area-inset-left));
        --right-safe-area: max(var(--edge-padding), env(safe-area-inset-right));
      `;
  }
}
