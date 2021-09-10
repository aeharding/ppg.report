export function getTrimmedCoordinates(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

export function isLatLonTrimmed(lat: string, lon: string): boolean {
  return getTrimmedCoordinates(+lat, +lon) === `${lat},${lon}`;
}
