import { css, SerializedStyles } from "@emotion/react/macro";

export function writeVariables(): SerializedStyles {
  return css`
    --bg-gradient-from: #0e0e0e;
    --bg-gradient-to: #001931;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --text: #eee;
    --softText: rgba(255, 255, 255, 0.3);
    --overscroll-background: #111;

    --left-safe-area: max(1rem, env(safe-area-inset-left));
    --right-safe-area: max(1rem, env(safe-area-inset-right));
  `;
}
