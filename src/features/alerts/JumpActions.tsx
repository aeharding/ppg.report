import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import throttle from "lodash/throttle";
import { useLayoutEffect, useState } from "react";

const Button = styled(FontAwesomeIcon)<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      color: #888;
      pointer-events: none;
    `}
`;

enum ScrollState {
  Start,
  Middle,
  End,
  None,
}

export default function JumpActions() {
  const [scrollState, setScrollState] = useState(ScrollState.Start);

  function jumpTo(offset: number) {
    const scrollView =
      document.querySelector<HTMLDivElement>("[data-rsbs-scroll]");
    const sections = [...scrollView!.querySelectorAll("section")];

    let currentSectionIndex = sections.findIndex(
      (section) =>
        Math.max(scrollView!.scrollTop, 0) <
        section.offsetTop - (scrollView?.offsetTop || 0)
    );

    if (currentSectionIndex === -1) currentSectionIndex = sections.length;

    currentSectionIndex = currentSectionIndex - 1;

    if (
      scrollView!.offsetHeight + scrollView!.scrollTop >=
      scrollView!.scrollHeight
    )
      currentSectionIndex = sections.length - 1;

    scrollView?.scrollTo({
      top:
        sections[currentSectionIndex + offset]?.offsetTop -
        scrollView.offsetTop,
      behavior: "smooth",
    });
  }

  useLayoutEffect(() => {
    const scrollView =
      document.querySelector<HTMLDivElement>("[data-rsbs-scroll]");

    const onScroll = throttle(() => {
      const sections = [...scrollView!.querySelectorAll("section")];

      if (sections.length === 1) {
        setScrollState(ScrollState.None);
        return;
      }

      if (
        scrollView!.offsetHeight + scrollView!.scrollTop >=
        scrollView!.scrollHeight
      ) {
        setScrollState(ScrollState.End);
        return;
      }

      let currentSectionIndex = sections.findIndex(
        (section) =>
          Math.max(scrollView!.scrollTop, 0) <
          section.offsetTop - (scrollView?.offsetTop || 0)
      );

      if (currentSectionIndex === -1) currentSectionIndex = sections.length;

      currentSectionIndex = currentSectionIndex - 1;

      switch (currentSectionIndex) {
        case 0:
          setScrollState(ScrollState.Start);
          break;
        case sections.length - 1:
          setScrollState(ScrollState.End);
          break;
        default:
          setScrollState(ScrollState.Middle);
      }
    }, 100);

    onScroll();
    scrollView?.addEventListener("scroll", onScroll);

    return () => scrollView?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Button
        icon={faAngleUp}
        onClick={() => jumpTo(-1)}
        disabled={
          scrollState === ScrollState.Start || scrollState === ScrollState.None
        }
      />
      <Button
        icon={faAngleDown}
        onClick={() => jumpTo(1)}
        disabled={
          scrollState === ScrollState.End || scrollState === ScrollState.None
        }
      />
    </>
  );
}
