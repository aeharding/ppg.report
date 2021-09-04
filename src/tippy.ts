import { css } from "@emotion/react/macro";

export const tippyStyles = css`
  .tippy-box {
    position: relative;
    background-color: var(--tooltip-background);
    color: var(--text);
    font-size: 14px;
    line-height: 1.4;
    outline: 0;
    transition-property: transform, visibility, opacity;
    text-align: left;
    border: var(--rim);
    border-radius: 0.5em;
    box-shadow: var(--tooltip-box-shadow);

    &[data-animation="fade"][data-state="hidden"] {
      opacity: 0;
      transform: scale(0.98);
    }

    &[data-inertia][data-state="visible"] {
      transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
    }
  }

  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }

  .tippy-content {
    position: relative;
    padding: 5px 9px;
    z-index: 1;
  }
`;
