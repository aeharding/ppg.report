import { css, Global } from "@emotion/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

import "./setupViewport";
import "./i18n";

import { createRoot } from "react-dom/client";

const globalStyles = css`
  :root {
    // https://stackoverflow.com/a/57708812
    --sat: env(safe-area-inset-top);
    --sar: env(safe-area-inset-right);
    --sab: env(safe-area-inset-bottom);
    --sal: env(safe-area-inset-left);
  }

  html {
    // Color for Safari overscroll
    // Has to be a solid color... because Safari
    background-color: var(--overscroll-background);

    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    position: relative; // needed for AsideHouses
    display: flex;
    flex-direction: column;
    min-height: 100vh; // AsideHouses, and keep footer at bottom of viewport

    color: var(--text);
    line-height: 1.4;

    box-sizing: border-box;

    @media (any-hover: none) {
      user-select: none;
    }

    @media (display-mode: standalone) {
      -webkit-tap-highlight-color: transparent;
    }
  }

  .leaflet-container {
    background: rgba(255, 255, 255, 0.05) !important;
  }

  *:focus {
    outline: none;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  #root {
    flex: 1;

    display: flex;
    flex-direction: column;
  }

  a {
    color: inherit;

    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const rootNode = document.getElementById("root");
const root = createRoot(rootNode!);
root.render(
  <>
    <Global styles={globalStyles} />
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);
