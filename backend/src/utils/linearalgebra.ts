/**
 * Dot product of two number arrays
 * @param v1 Vector of length n
 * @param v2 Vector of length n
 * @returns scalar number result of dot product
 */
export function DotProduct(v1: Array<number>, v2: Array<number>): number {
  let sum = 0;
  for (let i = 0; i < v1.length; i += 1) {
    sum += v1[i] * v2[i];
  }

  return sum;
}

/**
 * Component wise multiplication of vectors
 * @param v1 Vector of length n
 * @param v2 Vector of length n
 * @returns Vector of length n
 */
export function HadamardProduct(v1: Array<number>, v2: Array<number>): Array<number> {
  const result: Array<number> = [];
  for (let i = 0; i < v1.length; i += 1) {
    result.push(v1[i] * v2[i]);
  }

  return result;
}
