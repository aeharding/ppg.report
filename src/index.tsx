import React from "react";
import { css, Global } from "@emotion/react/macro";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { tippyStyles } from "./tippy";

import "./setupViewport";
import { render } from "react-dom";

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

  // Hack for https://github.com/stipsan/react-spring-bottom-sheet/issues/180#issuecomment-1144537142
  reach-portal {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
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

  ${tippyStyles}
`;

const rootNode = document.getElementById("root");
render(
  <>
    <Global styles={globalStyles} />
    <Provider store={store}>
      <App />
    </Provider>
  </>,
  rootNode
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
