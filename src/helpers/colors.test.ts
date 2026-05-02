import {
  outputP3ColorFromLab,
  outputP3ColorFromRGB,
  outputP3ColorFromRGBA,
} from "./colors";

// Parse `rgb(r, g, b)` from generated CSS. Used to assert numeric channel
// values within a tolerance, so the assertions remain valid across different
// underlying color-conversion implementations (FP differences are expected,
// real color shifts are not).
function parseRgbChannels(css: string): [number, number, number] {
  const match = css.match(/rgb\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)/);
  if (!match) throw new Error(`No rgb() found in: ${css}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function parseDisplayP3Channels(css: string): [number, number, number] {
  const match = css.match(
    /color\(display-p3\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\)/,
  );
  if (!match) throw new Error(`No color(display-p3 ...) found in: ${css}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

// Tolerance: ±1 channel out of 255 (≈0.4%). Catches any visible color shift,
// allows for floating-point differences between conversion libraries.
const RGB_TOLERANCE = 1;
const P3_TOLERANCE = RGB_TOLERANCE / 255;

describe("outputP3ColorFromLab", () => {
  it("converts black Lab to rgb(0,0,0) and display-p3 0 0 0", () => {
    const css = outputP3ColorFromLab([0, 0, 0]);
    const [r, g, b] = parseRgbChannels(css);
    expect(r).toBeCloseTo(0, 0);
    expect(g).toBeCloseTo(0, 0);
    expect(b).toBeCloseTo(0, 0);

    const [pr, pg, pb] = parseDisplayP3Channels(css);
    expect(pr).toBeCloseTo(0, 5);
    expect(pg).toBeCloseTo(0, 5);
    expect(pb).toBeCloseTo(0, 5);
  });

  it("converts mid-gray Lab L=50 to a true neutral gray", () => {
    const css = outputP3ColorFromLab([50, 0, 0]);
    const [r, g, b] = parseRgbChannels(css);
    // Channels should be equal (no color cast) and around mid-range.
    expect(Math.abs(r - g)).toBeLessThanOrEqual(RGB_TOLERANCE);
    expect(Math.abs(g - b)).toBeLessThanOrEqual(RGB_TOLERANCE);
    expect(r).toBeGreaterThan(110);
    expect(r).toBeLessThan(130);
  });

  it("converts a known yellow Lab value to expected sRGB", () => {
    // Lab values pinned to current @color-spaces/convert output for
    // approximately CSS yellow. Used to detect color shifts when swapping
    // the underlying conversion library.
    const css = outputP3ColorFromLab([97.6, -15.7, 93.4]);
    const [r, g, b] = parseRgbChannels(css);
    // Expect values close to yellow: high R, high G, low B
    expect(r).toBeGreaterThan(240);
    expect(g).toBeGreaterThan(240);
    expect(b).toBeLessThan(40);

    // display-p3 channel values are sRGB / 255 (no actual color-space mapping
    // — the implementation reuses the sRGB normalized values directly).
    const [pr, pg, pb] = parseDisplayP3Channels(css);
    expect(pr).toBeCloseTo(r / 255, 5);
    expect(pg).toBeCloseTo(g / 255, 5);
    expect(pb).toBeCloseTo(b / 255, 5);
  });

  it("converts a red-ish Lab value with positive a*", () => {
    const css = outputP3ColorFromLab([53.24, 80.09, 67.2]);
    const [r, g, b] = parseRgbChannels(css);
    // Should be predominantly red
    expect(r).toBeGreaterThan(g + 50);
    expect(r).toBeGreaterThan(b + 50);
  });

  it("respects the cssProperty argument for both rgb() and display-p3 lines", () => {
    const css = outputP3ColorFromLab([60, 20, -30], "background");
    expect(css).toMatch(/background:\s*rgb\(/);
    expect(css).toMatch(/background:\s*color\(display-p3/);
  });

  it("defaults the cssProperty to 'color'", () => {
    const css = outputP3ColorFromLab([60, 20, -30]);
    expect(css).toMatch(/color:\s*rgb\(/);
    expect(css).toMatch(/color:\s*color\(display-p3/);
  });

  // Pinned numeric expectations so a library swap that introduces a real
  // color shift will fail loudly. Values are compared after browser-style
  // clamping to [0, 255], which is what the user actually sees, so the
  // assertions are stable across implementations that differ only in
  // out-of-gamut handling. Tolerance is ±1 channel out of 255.
  it.each([
    {
      name: "black",
      lab: [0, 0, 0] as [number, number, number],
      expectedRgb: [0, 0, 0] as [number, number, number],
    },
    {
      name: "white-ish Lab",
      lab: [100, 0, 0] as [number, number, number],
      expectedRgb: [255, 255, 255] as [number, number, number],
    },
    {
      name: "yellow-ish Lab",
      lab: [97.6, -15.7, 93.4] as [number, number, number],
      expectedRgb: [255, 253, 22] as [number, number, number],
    },
    {
      name: "red-ish Lab",
      lab: [53.24, 80.09, 67.2] as [number, number, number],
      expectedRgb: [255, 0, 0] as [number, number, number],
    },
    {
      name: "blue-ish Lab",
      lab: [32.3, 79.2, -107.86] as [number, number, number],
      expectedRgb: [0, 0, 255] as [number, number, number],
    },
  ])("matches pinned RGB output for $name", ({ lab, expectedRgb }) => {
    const css = outputP3ColorFromLab(lab);
    const [r, g, b] = parseRgbChannels(css);
    const clamp = (n: number) => Math.max(0, Math.min(255, n));
    const [er, eg, eb] = expectedRgb;
    expect(Math.abs(clamp(r) - er)).toBeLessThanOrEqual(RGB_TOLERANCE);
    expect(Math.abs(clamp(g) - eg)).toBeLessThanOrEqual(RGB_TOLERANCE);
    expect(Math.abs(clamp(b) - eb)).toBeLessThanOrEqual(RGB_TOLERANCE);

    const [pr, pg, pb] = parseDisplayP3Channels(css);
    const clampUnit = (n: number) => Math.max(0, Math.min(1, n));
    expect(Math.abs(clampUnit(pr) - er / 255)).toBeLessThanOrEqual(
      P3_TOLERANCE,
    );
    expect(Math.abs(clampUnit(pg) - eg / 255)).toBeLessThanOrEqual(
      P3_TOLERANCE,
    );
    expect(Math.abs(clampUnit(pb) - eb / 255)).toBeLessThanOrEqual(
      P3_TOLERANCE,
    );
  });
});

describe("outputP3ColorFromRGB", () => {
  it("emits the rgb() and display-p3 lines with normalized channels", () => {
    const css = outputP3ColorFromRGB([255, 128, 0]);
    expect(css).toMatch(/color:\s*rgb\(255,\s*128,\s*0\)/);
    expect(css).toMatch(/color:\s*color\(display-p3\s+1\s+0\.50196\d*\s+0\)/);
  });

  it("respects the cssProperty argument", () => {
    const css = outputP3ColorFromRGB([10, 20, 30], "border-color");
    expect(css).toMatch(/border-color:\s*rgb\(10,\s*20,\s*30\)/);
    expect(css).toMatch(/border-color:\s*color\(display-p3/);
  });

  it("emits 0 for black", () => {
    const css = outputP3ColorFromRGB([0, 0, 0]);
    expect(css).toMatch(/color:\s*rgb\(0,\s*0,\s*0\)/);
    expect(css).toMatch(/color:\s*color\(display-p3\s+0\s+0\s+0\)/);
  });
});

describe("outputP3ColorFromRGBA", () => {
  it("emits rgba() and display-p3 with alpha", () => {
    const css = outputP3ColorFromRGBA([255, 0, 128, 0.5]);
    expect(css).toMatch(/color:\s*rgba\(255,\s*0,\s*128,\s*0\.5\)/);
    expect(css).toMatch(
      /color:\s*color\(display-p3\s+1\s+0\s+0\.50196\d*\s*\/\s*0\.5\)/,
    );
  });

  it("respects the cssProperty argument", () => {
    const css = outputP3ColorFromRGBA([0, 255, 0, 1], "background");
    expect(css).toMatch(/background:\s*rgba\(0,\s*255,\s*0,\s*1\)/);
    expect(css).toMatch(
      /background:\s*color\(display-p3\s+0\s+1\s+0\s*\/\s*1\)/,
    );
  });
});
