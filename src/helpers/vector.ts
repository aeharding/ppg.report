export function vectorDifferenceMagnitude(
  speed1: number,
  direction1: number,
  speed2: number,
  direction2: number,
): number {
  // Convert directions from degrees to radians
  const radian1 = (Math.PI / 180) * direction1;
  const radian2 = (Math.PI / 180) * direction2;

  // Convert polar coordinates to Cartesian coordinates
  const x1 = speed1 * Math.cos(radian1);
  const y1 = speed1 * Math.sin(radian1);
  const x2 = speed2 * Math.cos(radian2);
  const y2 = speed2 * Math.sin(radian2);

  // Calculate the difference in Cartesian coordinates
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate the magnitude of the difference vector
  return Math.sqrt(dx * dx + dy * dy);
}
