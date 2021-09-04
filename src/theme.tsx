import { css, SerializedStyles } from "@emotion/react/macro";

export enum Themes {
  Dark,
  Light,
}

export function writeVariables(theme: Themes): SerializedStyles {
  switch (theme) {
    case Themes.Dark:
      return css`
        --overscroll-background: #111;
        --bg-gradient-from: #0e0e0e;
        --bg-gradient-to: #001931;
        --hover-bg: rgba(255, 255, 255, 0.1);

        --text: #eee;
        --text-secondary: rgba(255, 255, 255, 0.8);
        --text-active: #00b7ff;
        --softText: rgba(255, 255, 255, 0.3);

        --table-box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);

        --error: red;
        --warning: yellow;

        --left-safe-area: max(1rem, env(safe-area-inset-left));
        --right-safe-area: max(1rem, env(safe-area-inset-right));

        --tooltip-background: #111;
        --tooltip-box-shadow: none;
      `;
    case Themes.Light:
      return css`
        --overscroll-background: #f6f8fa;
        --bg-gradient-from: #f6f8fa;
        --bg-gradient-to: #f6f8fa;
        --hover-bg: rgba(255, 255, 255, 0.1);

        --text: #000;
        --text-secondary: rgba(0, 0, 0, 0.8);
        --text-active: #00b7ff;
        --softText: rgba(0, 0, 0, 0.5);

        --table-box-shadow: 0;

        --error: red;
        --warning: #d6c800;

        --left-safe-area: max(1rem, env(safe-area-inset-left));
        --right-safe-area: max(1rem, env(safe-area-inset-right));

        --tooltip-background: #fff;
        --tooltip-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07),
          0 2px 4px rgba(0, 0, 0, 0.07), 0 4px 8px rgba(0, 0, 0, 0.07),
          0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07),
          0 32px 64px rgba(0, 0, 0, 0.07);

        --rim: 1px solid #ddd;
      `;
  }
}
