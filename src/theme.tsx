import { css } from "@emotion/react/macro";
import { createTheme } from "@material-ui/core/styles";

export enum Themes {
  Dark,
}

export function writeVariables(theme: Themes) {
  switch (theme) {
    case Themes.Dark:
      return css`
        --bg-gradient-from: #000;
        --bg-gradient-to: #000731;
        --hover-bg: rgba(255, 255, 255, 0.1);
        --text: #eee;
        --softText: rgba(255, 255, 255, 0.3);
        --rim: rgba(255, 255, 255, 0.1);

        --left-safe-area: max(1rem, env(safe-area-inset-left));
        --right-safe-area: max(1rem, env(safe-area-inset-right));
      `;
  }
}

export function createMuiTheme() {
  return createTheme({
    palette: {
      type: "dark",
    },
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "0.9rem",
          padding: "0.5em 0.75em",
          backgroundColor: "black",
        },
      },
    },
  });
}
