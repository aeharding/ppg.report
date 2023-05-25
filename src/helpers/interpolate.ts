interface Value {
  point: number;
  value: number;
}

export default function interpolate(
  targetPoint: number,
  ...values: Value[]
): number {
  // Sort the values array based on the point property
  values.sort((a, b) => a.point - b.point);

  // Find the two values that surround the target point
  let lowerValue: Value | undefined;
  let upperValue: Value | undefined;

  for (const value of values) {
    if (value.point <= targetPoint) {
      lowerValue = value;
    } else {
      upperValue = value;
      break;
    }
  }

  // If no upper or lower value found, return NaN
  if (!lowerValue || !upperValue) {
    return NaN;
  }

  // Perform linear interpolation
  const lowerWeight =
    (upperValue.point - targetPoint) / (upperValue.point - lowerValue.point);
  const upperWeight = 1 - lowerWeight;

  const interpolatedValue =
    lowerValue.value * lowerWeight + upperValue.value * upperWeight;
  return interpolatedValue;
}
