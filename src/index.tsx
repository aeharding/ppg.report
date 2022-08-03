import React from "react";
import { createRoot } from "react-dom/client";
import { css, Global } from "@emotion/react/macro";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { tippyStyles } from "./tippy";

import "./setupViewport";

const globalStyles = css`
  :root {
    /* --rsbs-backdrop-bg: rgba(0, 0, 0, 0.1); */
    --rsbs-handle-bg: hsla(0, 0%, 100%, 0.14);
    --rsbs-bg: #111317;
    --rsbs-max-w: 500px;

    --rsbs-ml: auto;
    --rsbs-mr: auto;
  }

  [data-rsbs-content] {
    overflow: initial;
    display: flex;
  }

  [data-rsbs-scroll="true"] {
    scroll-snap-type: x mandatory;
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

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
