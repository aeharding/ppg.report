import interpolate from "./interpolate";
import { interpolateWindVectors, WindVector } from "./interpolate";

describe("interpolateWindVectors", () => {
  describe("with opposing directions", () => {
    const vector1: WindVector = { height: 200, speed: 20, direction: 0 };
    const vector2: WindVector = { height: 400, speed: 20, direction: 180 };

    it("should interpolate wind vectors correctly at height 300", () => {
      const interpolatedVector = interpolateWindVectors(vector1, vector2, 300);
      expect(interpolatedVector.height).toBe(300);
      expect(interpolatedVector.speed).toBeCloseTo(0);
      expect(interpolatedVector.direction).toBeCloseTo(90, 5);
    });

    it("should interpolate wind vectors correctly at height 250", () => {
      const interpolatedVector = interpolateWindVectors(vector1, vector2, 250);
      expect(interpolatedVector.height).toBe(250);
      expect(interpolatedVector.speed).toBeCloseTo(10);
      expect(interpolatedVector.direction).toBeCloseTo(0, 5);
    });
  });

  describe("should interpolate wind vectors correctly with same direction and increasing speed", () => {
    const vector1: WindVector = { height: 200, speed: 20, direction: 90 };
    const vector2: WindVector = { height: 400, speed: 40, direction: 90 };

    it("at height 300", () => {
      const interpolatedVector1 = interpolateWindVectors(vector1, vector2, 300);
      expect(interpolatedVector1.height).toBe(300);
      expect(interpolatedVector1.speed).toBeCloseTo(30);
      expect(interpolatedVector1.direction).toBeCloseTo(90, 5);
    });
    it("at height 250", () => {
      const interpolatedVector2 = interpolateWindVectors(vector1, vector2, 250);
      expect(interpolatedVector2.height).toBe(250);
      expect(interpolatedVector2.speed).toBeCloseTo(25);
      expect(interpolatedVector2.direction).toBeCloseTo(90, 5);
    });
  });

  it("should interpolate wind vectors correctly with same speed and slightly different directions", () => {
    const vector1: WindVector = { height: 200, speed: 30, direction: 45 };
    const vector2: WindVector = { height: 400, speed: 30, direction: 50 };

    it("at height 300", () => {
      const interpolatedVector1 = interpolateWindVectors(vector1, vector2, 300);
      expect(interpolatedVector1.height).toBe(300);
      expect(interpolatedVector1.speed).toBeLessThan(30);
      expect(interpolatedVector1.direction).toBeCloseTo(47.5, 5);
    });

    it("at height 250", () => {
      const interpolatedVector2 = interpolateWindVectors(vector1, vector2, 250);
      expect(interpolatedVector2.height).toBe(250);
      expect(interpolatedVector2.speed).toBeLessThan(30);
      expect(interpolatedVector2.direction).toBeCloseTo(46.25);
    });
  });
});

describe("interpolate", () => {
  const values = [
    { point: 0, value: 0 },
    { point: 5, value: 50 },
    { point: 10, value: 100 },
  ];

  it("should return NaN if no values are provided", () => {
    expect(interpolate(5)).toBeNaN();
  });

  it("should return NaN if only one value is provided", () => {
    expect(interpolate(5, { point: 10, value: 100 })).toBeNaN();
  });

  it("should return NaN even if target point matches an exact point", () => {
    expect(interpolate(10, ...values)).toBeNaN();
  });

  it("should interpolate the value between two points", () => {
    expect(interpolate(2, ...values)).toBeCloseTo(20);
    expect(interpolate(8, ...values)).toBeCloseTo(80);
  });

  it("should handle values in descending order", () => {
    const descendingValues = values.slice().reverse();
    expect(interpolate(2, ...descendingValues)).toBeCloseTo(20);
    expect(interpolate(8, ...descendingValues)).toBeCloseTo(80);
  });
});
