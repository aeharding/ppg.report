import { isPossiblyWithinUSA } from "./geo";

describe("isPossiblyWithinUSA", () => {
  describe("should return true", () => {
    describe("when given coordinates within the United States", () => {
      describe("for coordinates within different CONUS cities", () => {
        it("e.g. San Francisco, California (West)", () => {
          expect(isPossiblyWithinUSA(37.7749, -122.4194)).toBe(true);
        });

        it("e.g. Miami, Florida (South)", () => {
          expect(isPossiblyWithinUSA(25.7617, -80.1918)).toBe(true);
        });

        it("e.g. New York City, New York (East)", () => {
          expect(isPossiblyWithinUSA(40.7128, -74.006)).toBe(true);
        });

        it("e.g. Minneapolis, Minnesota (North)", () => {
          expect(isPossiblyWithinUSA(44.9778, -93.265)).toBe(true);
        });
      });

      describe("for coordinates within Alaska", () => {
        it("e.g. Anchorage, Alaska", () => {
          expect(isPossiblyWithinUSA(61.2181, -149.9003)).toBe(true);
        });
        it("e.g. Fairbanks, Alaska", () => {
          expect(isPossiblyWithinUSA(64.2008, -149.4937)).toBe(true);
        });
      });

      it("for coordinates within Hawaii", () => {
        expect(isPossiblyWithinUSA(21.3069, -157.8583)).toBe(true); // Honolulu, Hawaii
        expect(isPossiblyWithinUSA(20.7984, -156.3319)).toBe(true); // Lahaina, Hawaii
      });
    });

    describe("when given coordinates within U.S. territories or colonies", () => {
      it("e.g. San Juan, Puerto Rico", () => {
        expect(isPossiblyWithinUSA(18.4655, -66.1057)).toBe(true);
      });

      it("e.g. Pago Pago, American Samoa", () => {
        expect(isPossiblyWithinUSA(-14.275, -170.702)).toBe(true);
      });

      it("e.g. Hagåtña, Guam", () => {
        expect(isPossiblyWithinUSA(13.4443, 144.7937)).toBe(true);
      });
    });
  });

  describe("should return false outside the United States", () => {
    it("e.g. London, United Kingdom", () => {
      expect(isPossiblyWithinUSA(51.5074, -0.1278)).toBe(false);
    });

    it("e.g. Sydney, Australia", () => {
      expect(isPossiblyWithinUSA(-33.8651, 151.2099)).toBe(false);
    });

    it("e.g. Paris, France", () => {
      expect(isPossiblyWithinUSA(48.8566, 2.3522)).toBe(false);
    });

    it("e.g. Rio de Janeiro, Brazil", () => {
      expect(isPossiblyWithinUSA(-22.9068, -43.1729)).toBe(false);
    });

    it("e.g. Tokyo, Japan", () => {
      expect(isPossiblyWithinUSA(35.6895, 139.6917)).toBe(false);
    });
  });
});
