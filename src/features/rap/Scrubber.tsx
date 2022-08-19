import { keyframes } from "@emotion/css";
import styled from "@emotion/styled/macro";
import { faHandPointUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { isTouchDevice } from "../../helpers/device";

const HowTo = styled.div`
  opacity: 0.3;
  text-align: center;
  font-size: 0.8em;
  transform: translateY(-0.75rem);
`;

const transitionName = "scrubber";

const ScrubberTarget = styled.div`
  --bottom: calc(max(var(--edge-padding), env(safe-area-inset-bottom)) + 2rem);

  @media (orientation: landscape) {
    --bottom: calc(
      max(var(--edge-padding), env(safe-area-inset-bottom)) + 1rem
    );
  }

  position: fixed;
  bottom: var(--bottom);
  left: var(--left-safe-area);
  right: var(--right-safe-area);
  max-width: 500px;
  margin: 0 auto;
  height: 4rem;
  backdrop-filter: blur(16px) brightness(90%) saturate(120%);
  border-radius: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1;

  display: flex;
  justify-content: space-between;
  padding: 0.4rem 1rem;

  transition: border-color 500ms linear;

  &::after {
    content: "";
    position: absolute;
    inset: 0;

    background: repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 10px,
      rgba(255, 255, 255, 0.3) 10px,
      rgba(255, 255, 255, 0.3) 11px,
      transparent 11px
    );
    mask: radial-gradient(closest-side, rgba(0, 0, 0, 0.9) 0px, #0000 100%);
  }

  transition-duration: 200ms;
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(
    0.095,
    0.46,
    0.43,
    1.175
  ); /* custom */

  // enter from
  &.${transitionName}-enter {
    transform: translateY(calc(var(--bottom) + 100%));
  }

  // enter to
  &.${transitionName}-enter-active {
    opacity: 1;
    transform: translateY(0);
  }

  // exit from
  &.${transitionName}-exit {
    opacity: 1;
    transform: translateY(0);
  }

  // exit to
  &.${transitionName}-exit-active {
    transition-timing-function: ease-out;
    transform: translateY(calc(var(--bottom) + 100%));
  }
`;

const Label = styled.div`
  font-size: 0.8rem;
  font-weight: 200;
  opacity: 0.7;
`;

const fingerSwipe = keyframes`
  from {
    transform: translateX(calc(-25% - 50px));
  }

  to {
    transform: translateX(calc(-25% + 50px));
  }
`;

const Finger = styled(FontAwesomeIcon)`
  font-size: 3rem;
  position: absolute;
  left: 50%;
  bottom: -1.5rem;

  color: #999;

  animation: ${fingerSwipe} 2s ease-in-out;
  animation-direction: alternate-reverse;
  animation-iteration-count: infinite;
`;

const USED_SCRUBBER_STORAGE_KEY = "used-scrubber";

interface ScrubberProps {
  scrollViewRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export default function Scrubber({ scrollViewRef, children }: ScrubberProps) {
  const [enabled, setEnabled] = useState(false);
  const [interacted, setInteracted] = useState(
    JSON.parse(localStorage.getItem(USED_SCRUBBER_STORAGE_KEY) ?? "false")
  );
  const scrubberTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollView = scrollViewRef.current;
    const scrubberTarget = scrubberTargetRef.current;

    if (!enabled) {
      unmount();
      return;
    }

    if (!scrollView || !scrubberTarget) return;

    scrubberTarget.addEventListener("touchstart", onScrubStart);
    scrubberTarget.addEventListener("touchmove", onScrubMove);

    let interactionCount = 0;

    let width = 0;
    let x = 0;
    const margin = 20;

    function onScrubStart(e: TouchEvent) {
      if (!scrollView || !scrubberTarget) return;

      const bbox = scrubberTargetRef.current.getBoundingClientRect();
      width = bbox.width;
      x = bbox.x;

      setInteracted(true);

      if (interactionCount > 100)
        localStorage.setItem(USED_SCRUBBER_STORAGE_KEY, "true");

      onScrub(e);
    }

    function onScrubMove(e: TouchEvent) {
      e.preventDefault();

      onScrub(e);
    }

    function onScrub(e: TouchEvent) {
      e.stopPropagation();

      if (!scrollView || !scrubberTarget) return;

      if (e.touches[0] == null) return;

      const percentageScrolled =
        (e.touches[0].pageX - (x + margin)) / (width - margin * 2);

      scrollView.scrollLeft =
        (scrollView.scrollWidth - scrollView.clientWidth) * percentageScrolled;

      interactionCount++;
    }

    function unmount() {
      if (!scrollView || !scrubberTarget) return;

      scrubberTarget.removeEventListener("touchstart", onScrubStart);
      scrubberTarget.removeEventListener("touchmove", onScrubMove);
    }

    return unmount;
  }, [scrollViewRef, scrubberTargetRef, enabled]);

  useEffect(() => {
    function onDocumentScroll() {
      setEnabled(false);
    }

    if (enabled) {
      document.addEventListener("scroll", onDocumentScroll);
    } else {
      document.removeEventListener("scroll", onDocumentScroll);
    }

    return () => document.removeEventListener("scroll", onDocumentScroll);
  }, [enabled]);

  if (!isTouchDevice()) return <>{children}</>;

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      onTouchMove={enabled ? () => setEnabled(false) : undefined}
    >
      {children}
      <HowTo>Tap to {enabled ? "close" : ""} quick scrub</HowTo>
      <CSSTransition
        timeout={150}
        classNames={transitionName}
        unmountOnExit
        in={enabled}
      >
        <ScrubberTarget
          ref={scrubberTargetRef}
          onClick={(e) => e.stopPropagation()}
        >
          <Label>+0hr</Label>
          <Label>+12hr</Label>
          <Label>+24hr</Label>
          {!interacted && <Finger icon={faHandPointUp} />}
        </ScrubberTarget>
      </CSSTransition>
    </div>
  );
}
