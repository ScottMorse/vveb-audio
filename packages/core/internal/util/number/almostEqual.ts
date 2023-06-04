/** Determine if number A is close to number B, providing a max difference between the two. Inclusive by default. */
export const almostEqual = (
  a: number,
  b: number,
  threshold: number,
  inclusive = true
) => {
  const difference = Math.abs(a - b)
  const max = Math.abs(threshold)
  return inclusive ? max >= difference : max > difference
}
