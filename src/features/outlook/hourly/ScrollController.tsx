import { useLayoutEffect, useRef } from "react";

export default function ScrollController() {
  const highlightDragState = useRef({ left: 0, x: 0 });

  /**
   * Control native scrolling to update highlight
   */
  useLayoutEffect(() => {
    const detailTableEl = document.getElementById("detail-table");
    const summaryTableEl = document.getElementById("summary-table");
    const highlightEl = document.getElementById("summary-table-highlight");

    if (!detailTableEl || !highlightEl || !summaryTableEl)
      throw new Error("Could not setup");

    detailTableEl.addEventListener("scroll", updateHighlightPosition);

    return () => {
      detailTableEl.removeEventListener("scroll", updateHighlightPosition);
    };
  }, []);

  /**
   * Drag highlight to update scroll
   */
  useLayoutEffect(() => {
    const detailTableEl = document.getElementById("detail-table");
    const highlightEl = document.getElementById("summary-table-highlight");
    const summaryTableEl = document.getElementById("summary-table");

    if (!detailTableEl || !highlightEl) throw new Error("Could not setup");

    const mouseMoveHandler = (e: MouseEvent) => {
      const detailCellCount = summaryTableEl?.querySelectorAll("td").length;
      if (!detailCellCount) return;

      const maxOffset =
        window.innerWidth -
        (window.innerWidth / 32) * (window.innerWidth / detailCellCount);

      // How far the mouse has been moved
      const dx = e.clientX - highlightDragState.current.x;
      const offset = Math.min(
        Math.max(highlightDragState.current.left + dx, 0),
        maxOffset
      );

      // Scroll the element
      highlightEl.style.transform = `translateX(${offset}px)`;

      const percentScrolled =
        offset / (window.innerWidth - parseWidth(highlightEl.style.width));

      detailTableEl.scrollLeft =
        percentScrolled * (detailTableEl.scrollWidth - window.innerWidth);
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);

      document.body.style.cursor = "";
      document.body.style.removeProperty("user-select");

      detailTableEl.addEventListener("scroll", updateHighlightPosition);
    };

    const mouseDownHandler = (e: MouseEvent) => {
      const left = getOffsetFromTransform(highlightEl.style.transform);

      if (left == null) return;

      highlightDragState.current = {
        // The current scroll
        left,
        // Get the current mouse position
        x: e.clientX,
      };

      // Change the cursor and prevent user from selecting the text
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
      detailTableEl.removeEventListener("scroll", updateHighlightPosition);
    };

    highlightEl?.addEventListener("mousedown", mouseDownHandler);
  }, []);

  useLayoutEffect(() => {
    function onResize() {
      updateHighlightWidth();
      updateHighlightPosition();
    }

    window.addEventListener("resize", onResize);

    updateHighlightWidth();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return <></>;
}

function updateHighlightPosition() {
  const summaryTableEl = document.getElementById("summary-table");
  const detailTableEl = document.getElementById("detail-table");
  const highlightEl = document.getElementById("summary-table-highlight");

  if (!detailTableEl || !highlightEl || !summaryTableEl)
    throw new Error("Could not setup");

  const offset = getHorizontalScrollPercentage(detailTableEl);
  const detailCellCount = summaryTableEl.querySelectorAll("td").length;

  highlightEl.style.transform = `translateX(${
    (offset / 100) *
    (window.innerWidth -
      (window.innerWidth / 32) * (window.innerWidth / detailCellCount))
  }px)`;
}
function updateHighlightWidth() {
  const summaryTableEl = document.getElementById("summary-table");
  const highlightEl = document.getElementById("summary-table-highlight");

  if (!summaryTableEl || !highlightEl) return;

  const detailCellCount = summaryTableEl.querySelectorAll("td").length;

  if (detailCellCount < 10) return;

  highlightEl.style.width = `${
    (window.innerWidth / 32) * (window.innerWidth / detailCellCount)
  }px`;
}

function getHorizontalScrollPercentage(el: HTMLElement) {
  return (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
}

function getOffsetFromTransform(transformStr: string): number | undefined {
  const match = transformStr.match(/([+-]?([0-9]*[.])?[0-9]+)px/)?.[1];
  return match != null ? +match : 0;
}

function parseWidth(width: string): number {
  return +width.slice(0, -2);
}
