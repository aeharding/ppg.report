import throttle from "lodash/throttle";

function _hideAllTippy() {
  [...document.querySelectorAll("*")].forEach((node) => {
    if ((node as any)._tippy) {
      (node as any)._tippy.hide();
    }
  });
}

export const hideAllTippy = throttle(_hideAllTippy, 1000);
