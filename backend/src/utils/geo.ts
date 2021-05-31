import { EarthRadius } from './constants';

/**
 * Calculate distance between two lat/lng points using Spherical cosine method
 * @param lat1 Point 1 latitude
 * @param lng1 Point 1 longitude
 * @param lat2 Point 2 latitude
 * @param lng2 Point 2 longitude
 * @returns Approx distance between points
 */
export function SphericalCosine(lat1: number, lng1:number, lat2:number, lng2:number): number {
  const { sin, cos } = Math;
  const deg2rad = Math.PI / 180;

  const lat1rad = lat1 * deg2rad;
  const lat2rad = lat2 * deg2rad;
  return Math.acos(sin(lat1rad) * sin(lat2rad) + cos(lat1rad) * cos(lat2rad) * cos((lng2 - lng1) * deg2rad)) * EarthRadius;
}
