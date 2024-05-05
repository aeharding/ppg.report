import { ColorSpace, convertColorToSpace } from "@color-spaces/convert";

export function outputP3ColorFromLab(
  lab: [number, number, number],
  cssProperty = "color",
) {
  const {
    values: [r, g, b],
  } = convertColorToSpace(
    { type: ColorSpace.Lab, values: lab },
    ColorSpace.sRGB,
  );

  return `
    ${cssProperty}: rgb(${r * 255}, ${g * 255}, ${b * 255});
    ${cssProperty}: color(display-p3 ${r} ${g} ${b});
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
