export function getTrimmedCoordinates(lat: number, lon: number): string {
  return `${lat.toPrecision(6)},${lon.toPrecision(6)}`;
}

export function isLatLonTrimmed(lat: string, lon: string): boolean {
  return getTrimmedCoordinates(+lat, +lon) === `${lat},${lon}`;
}
