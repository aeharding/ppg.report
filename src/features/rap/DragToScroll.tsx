import { useEffect } from "react";
import { useRef } from "react";
import { detect } from "detect-browser";

export default function DragToScroll({ ...rest }) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ top: 0, left: 0, x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) throw new Error("ref not defined");

    ref.current.style.setProperty("scroll-snap-type", "x mandatory");
  }, []);

  function mouseDownHandler(e: React.MouseEvent) {
    if (!ref.current) throw new Error("ref not defined");

    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
    ref.current.style.removeProperty("scroll-snap-type");
    // scroll-snap-type: x mandatory;
    posRef.current = {
      left: ref.current.scrollLeft,
      top: ref.current.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  function mouseMoveHandler(e: MouseEvent) {
    if (!ref.current) throw new Error("ref not defined");

    // How far the mouse has been moved
    const dx = e.clientX - posRef.current.x;
    const dy = e.clientY - posRef.current.y;
    // Scroll the element
    ref.current.scrollTop = posRef.current.top - dy;
    ref.current.scrollLeft = posRef.current.left - dx;
  }

  function mouseUpHandler() {
    if (!ref.current) throw new Error("ref not defined");

    ref.current.style.removeProperty("cursor");
    ref.current.style.removeProperty("user-select");

    const offsets = Array.prototype.slice
      .call(ref.current.children)
      .map((child: HTMLElement) => child.offsetLeft);

    const closestOffset = findClosest(ref.current.scrollLeft, offsets);

    scrollTo(ref.current, closestOffset, () => {
      if (!ref.current) throw new Error("ref not defined");
      ref.current.style.setProperty("scroll-snap-type", "x mandatory");
    });
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  // Safari is the worst...
  if (detect()?.name === "safari") return <div ref={ref} {...rest} />;

  return <div ref={ref} onMouseDown={mouseDownHandler} {...rest} />;
}

/**
 * Native scrollTo with callback
 * @param offset - offset to scroll to
 * @param callback - callback function
 */
function scrollTo(el: HTMLDivElement, offset: number, callback: () => void) {
  const fixedOffset = offset.toFixed();
  const onScroll = function () {
    if (el.scrollLeft.toFixed() === fixedOffset) {
      el.removeEventListener("scroll", onScroll);
      callback();
    }
  };

  el.addEventListener("scroll", onScroll);
  onScroll();
  el.scrollTo({
    left: offset,
    behavior: "smooth",
  });
}

function findClosest(needle: number, haystack: number[]) {
  return haystack.reduce((a, b) => {
    let aDiff = Math.abs(a - needle);
    let bDiff = Math.abs(b - needle);

    if (aDiff === bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}
