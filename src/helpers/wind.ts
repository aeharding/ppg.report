import { WindsAloftAltitude } from "../models/WindsAloft";

interface WindVector {
  height: number;
  speed: number;
  direction: number;
}

export function interpolateWindVectors(
  vector1: WindVector,
  vector2: WindVector,
  height: number
): WindVector {
  let { height: height1, speed: speed1, direction: direction1 } = vector1;
  let { height: height2, speed: speed2, direction: direction2 } = vector2;

  // Calculate the interpolation factor
  const factor = (height - height1) / (height2 - height1);

  // Interpolate direction
  let angularDifference = direction2 - direction1;
  if (angularDifference > 180) {
    angularDifference -= 360;
  } else if (angularDifference < -180) {
    angularDifference += 360;
  }

  if (Math.abs(angularDifference) <= 180) {
  } else {
    if (direction2 > direction1) {
      direction2 -= 360;
    } else {
      direction1 -= 360;
    }
  }

  // Calculate interpolated wind vector components
  const x1 = speed1 * Math.cos((direction1 * Math.PI) / 180);
  const y1 = speed1 * Math.sin((direction1 * Math.PI) / 180);
  const x2 = speed2 * Math.cos((direction2 * Math.PI) / 180);
  const y2 = speed2 * Math.sin((direction2 * Math.PI) / 180);
  const interpolatedX = x1 + factor * (x2 - x1);
  const interpolatedY = y1 + factor * (y2 - y1);

  // Calculate magnitude of the interpolated wind vector
  const interpolatedSpeed = Math.sqrt(
    interpolatedX * interpolatedX + interpolatedY * interpolatedY
  );

  // Calculate direction of the interpolated wind vector
  const interpolatedVectorDirection =
    (Math.atan2(interpolatedY, interpolatedX) * 180) / Math.PI;
  const interpolatedVectorDirectionPositive =
    (interpolatedVectorDirection + 360) % 360;

  // Return the interpolated wind vector object
  return {
    height,
    speed: interpolatedSpeed,
    direction: interpolatedVectorDirectionPositive,
  };
}

export function convertToInterpolator(
  windAltitude: WindsAloftAltitude
): WindVector {
  return {
    height: windAltitude.altitudeInM,
    speed: windAltitude.windSpeedInKph,
    direction: windAltitude.windDirectionInDeg,
  };
}
