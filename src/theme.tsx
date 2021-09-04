import { css, SerializedStyles } from "@emotion/react/macro";

export enum Themes {
  Dark,
  Light,
}

export function writeVariables(theme: Themes): SerializedStyles {
  switch (theme) {
    case Themes.Dark:
      return css`
        --bg-gradient-from: #0e0e0e;
        --bg-gradient-to: #001931;
        --hover-bg: rgba(255, 255, 255, 0.1);
        --text: #eee;
        --softText: rgba(255, 255, 255, 0.3);
        --rim: rgba(255, 255, 255, 0.1);

        --left-safe-area: max(1rem, env(safe-area-inset-left));
        --right-safe-area: max(1rem, env(safe-area-inset-right));
      `;
    case Themes.Light:
      return css`
        --bg-gradient-from: #ffffff;
        --bg-gradient-to: #e1f0ff;
        --hover-bg: rgba(255, 255, 255, 0.1);
        --text: #1d1d1d;
        --softText: rgba(255, 255, 255, 0.3);
        --rim: rgba(255, 255, 255, 0.1);

        --left-safe-area: max(1rem, env(safe-area-inset-left));
        --right-safe-area: max(1rem, env(safe-area-inset-right));
      `;
  }
}
