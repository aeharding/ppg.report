export default interface Geocode {
  label: string;
  lat: number;
  lon: number;

  /**
   * If the result is a fallback label (raw coordinates, not human readable)
   */
  isFallbackLabel?: boolean;
}
