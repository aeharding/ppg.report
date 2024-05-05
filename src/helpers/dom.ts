export function scrollIntoViewIfNeeded(
  element: HTMLElement,
  smooth = true,
): void {
  const parentScroll = getScrollParent(element);

  if (!parentScroll) {
    return; // Element's parent scroll view not found
  }

  const parentScrollRect = parentScroll.getBoundingClientRect();

  const scrollPaddingLeft = parseInt(
    getComputedStyle(parentScroll).scrollPaddingLeft || "0",
    10,
  );
  const scrollPaddingRight = parseInt(
    getComputedStyle(parentScroll).scrollPaddingRight || "0",
    10,
  );
  const scrollPaddingTop = parseInt(
    getComputedStyle(parentScroll).scrollPaddingTop || "0",
    10,
  );
  const scrollPaddingBottom = parseInt(
    getComputedStyle(parentScroll).scrollPaddingBottom || "0",
    10,
  );

  const scrollLeft = calculateScrollLeft(
    element,
    parentScroll,
    parentScrollRect,
    scrollPaddingLeft,
    scrollPaddingRight,
  );
  const scrollTop = calculateScrollTop(
    element,
    parentScroll,
    parentScrollRect,
    scrollPaddingTop,
    scrollPaddingBottom,
  );

  if (
    scrollLeft !== parentScroll.scrollLeft ||
    scrollTop !== parentScroll.scrollTop
  ) {
    parentScroll.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: smooth ? "smooth" : undefined,
    });
  }
}

function calculateScrollLeft(
  element: HTMLElement,
  parentScroll: HTMLElement,
  parentScrollRect: DOMRect,
  scrollPaddingLeft: number,
  scrollPaddingRight: number,
): number {
  const elementRect = element.getBoundingClientRect();

  const scrollPaddingLeftValue = Number.isNaN(scrollPaddingLeft)
    ? 0
    : scrollPaddingLeft;
  const scrollPaddingRightValue = Number.isNaN(scrollPaddingRight)
    ? 0
    : scrollPaddingRight;

  if (elementRect.left - scrollPaddingLeftValue < parentScrollRect.left) {
    return (
      element.offsetLeft - parentScroll.offsetLeft - scrollPaddingLeftValue
    );
  }

  if (elementRect.right + scrollPaddingRightValue > parentScrollRect.right) {
    return (
      element.offsetLeft +
      element.offsetWidth -
      parentScroll.offsetWidth +
      scrollPaddingRightValue
    );
  }

  return parentScroll.scrollLeft;
}

function calculateScrollTop(
  element: HTMLElement,
  parentScroll: HTMLElement,
  parentScrollRect: DOMRect,
  scrollPaddingTop: number,
  scrollPaddingBottom: number,
): number {
  const elementRect = element.getBoundingClientRect();

  const scrollPaddingTopValue = Number.isNaN(scrollPaddingTop)
    ? 0
    : scrollPaddingTop;
  const scrollPaddingBottomValue = Number.isNaN(scrollPaddingBottom)
    ? 0
    : scrollPaddingBottom;

  if (elementRect.top - scrollPaddingTopValue < parentScrollRect.top) {
    return element.offsetTop - parentScroll.offsetTop - scrollPaddingTopValue;
  }

  if (elementRect.bottom + scrollPaddingBottomValue > parentScrollRect.bottom) {
    return (
      element.offsetTop +
      element.offsetHeight -
      parentScroll.offsetHeight +
      scrollPaddingBottomValue
    );
  }

  return parentScroll.scrollTop;
}

export function getScrollParent(
  node: HTMLElement | undefined,
): HTMLElement | undefined {
  if (!node) return;

  if (
    node.scrollHeight > node.clientHeight ||
    node.scrollWidth > node.clientWidth
  ) {
    return node;
  } else if (node.parentNode instanceof HTMLElement) {
    return getScrollParent(node.parentNode);
  }
}
