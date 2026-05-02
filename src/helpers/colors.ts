import chroma from "chroma-js";

export function outputP3ColorFromLab(
  lab: [number, number, number],
  cssProperty = "color",
) {
  // `rgb(false)` returns unclamped channels in the 0–255 range so the browser
  // can clamp on its own (matches the previous `@color-spaces/convert`
  // behavior). The display-p3 line reuses the normalized sRGB values directly,
  // which is intentionally unfaithful to the actual P3 gamut — it produces a
  // slightly more saturated rendering on wide-gamut displays.
  const [r, g, b] = chroma.lab(...lab).rgb(false);

  return `
    ${cssProperty}: rgb(${r}, ${g}, ${b});
    ${cssProperty}: color(display-p3 ${r / 255} ${g / 255} ${b / 255});
  `;
}

export function outputP3ColorFromRGB(
  [r, g, b]: [number, number, number],
  cssProperty = "color",
) {
  return `
    ${cssProperty}: rgb(${r}, ${g}, ${b});
    ${cssProperty}: color(display-p3 ${r / 255} ${g / 255} ${b / 255});
  `;
}

export function outputP3ColorFromRGBA(
  [r, g, b, a]: [number, number, number, number],
  cssProperty = "color",
) {
  return `
    ${cssProperty}: rgba(${r}, ${g}, ${b}, ${a});
    ${cssProperty}: color(display-p3 ${r / 255} ${g / 255} ${b / 255} / ${a});
  `;
}
