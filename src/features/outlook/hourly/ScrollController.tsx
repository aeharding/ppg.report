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

    const detailCellCount = summaryTableEl.querySelectorAll("td").length;

    if (!detailTableEl || !highlightEl || !summaryTableEl)
      throw new Error("Could not setup");

    const updateHighlightPositionCb = updateHighlightPosition(
      summaryTableEl,
      detailTableEl,
      highlightEl,
      detailCellCount
    );

    detailTableEl.addEventListener("scroll", updateHighlightPositionCb, {
      passive: true,
    });

    return () => {
      detailTableEl.removeEventListener("scroll", updateHighlightPositionCb);
    };
  }, []);

  /**
   * Drag highlight to update scroll
   */
  useLayoutEffect(() => {
    const detailTableEl = document.getElementById("detail-table");
    const highlightEl = document.getElementById("summary-table-highlight");
    const summaryTableEl = document.getElementById("summary-table");

    if (!detailTableEl || !highlightEl || !summaryTableEl)
      throw new Error("Could not setup");

    const detailCellCount = summaryTableEl.querySelectorAll("td").length;

    const updateHighlightPositionCb = updateHighlightPosition(
      summaryTableEl,
      detailTableEl,
      highlightEl,
      detailCellCount
    );

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      const detailCellCount = summaryTableEl?.querySelectorAll("td").length;
      if (!detailCellCount) return;

      const maxOffset =
        window.innerWidth -
        (window.innerWidth / 32) * (window.innerWidth / detailCellCount);

      // How far the mouse has been moved
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = clientX - highlightDragState.current.x;
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
      document.removeEventListener("touchmove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("touchend", mouseUpHandler);

      document.body.style.cursor = "";
      document.body.style.removeProperty("user-select");

      detailTableEl.addEventListener("scroll", updateHighlightPositionCb, {
        passive: true,
      });
    };

    const mouseDownHandler = (e: MouseEvent | TouchEvent) => {
      const left = getOffsetFromTransform(highlightEl.style.transform);

      if (left == null) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

      highlightDragState.current = {
        // The current scroll
        left,
        // Get the current mouse position
        x: clientX,
      };

      // Change the cursor and prevent user from selecting the text
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("touchmove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
      document.addEventListener("touchend", mouseUpHandler);
      detailTableEl.removeEventListener("scroll", updateHighlightPositionCb);
    };

    summaryTableEl?.addEventListener("mousedown", mouseDownHandler);
    highlightEl?.addEventListener("mousedown", mouseDownHandler);
    summaryTableEl?.addEventListener("touchstart", mouseDownHandler);
    highlightEl?.addEventListener("touchstart", mouseDownHandler);

    return () => {
      summaryTableEl?.removeEventListener("mousedown", mouseDownHandler);
      highlightEl?.removeEventListener("mousedown", mouseDownHandler);
      summaryTableEl?.removeEventListener("touchstart", mouseDownHandler);
      highlightEl?.removeEventListener("touchstart", mouseDownHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("touchmove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("touchend", mouseUpHandler);
    };
  }, []);

  useLayoutEffect(() => {
    const detailTableEl = document.getElementById("detail-table");
    const highlightEl = document.getElementById("summary-table-highlight");
    const summaryTableEl = document.getElementById("summary-table");

    if (!detailTableEl || !highlightEl || !summaryTableEl)
      throw new Error("Could not setup");

    const detailCellCount = summaryTableEl.querySelectorAll("td").length;

    const updateHighlightPositionCb = updateHighlightPosition(
      summaryTableEl,
      detailTableEl,
      highlightEl,
      detailCellCount
    );

    function onResize() {
      updateHighlightWidth();
      updateHighlightPositionCb();
    }

    window.addEventListener("resize", onResize);

    updateHighlightWidth();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return <></>;
}

function updateHighlightPosition(
  summaryTableEl: HTMLElement,
  detailTableEl: HTMLElement,
  highlightEl: HTMLElement,
  detailCellCount: number
) {
  let scrolledTime = 0;
  let running = false;

  return () => {
    scrolledTime = Date.now();
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  };

  function loop() {
    const offset = getHorizontalScrollPercentage(detailTableEl);

    highlightEl.style.transform = `translateX(${Math.round(
      (offset / 100) *
        (window.innerWidth -
          (window.innerWidth / 32) * (window.innerWidth / detailCellCount))
    )}px)`;

    if (Date.now() - scrolledTime > 250) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }
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
