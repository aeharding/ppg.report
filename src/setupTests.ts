// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// ResizeObserver is not available in test environment
class ResizeObserver {
  observe() {}
  unobserve() {}
}
(window as any).ResizeObserver = ResizeObserver;
export default ResizeObserver;
