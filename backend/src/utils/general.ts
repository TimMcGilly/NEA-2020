export function WrapInfTo0(x: number): number {
  return Number.isFinite(x) ? x : 0;
}
