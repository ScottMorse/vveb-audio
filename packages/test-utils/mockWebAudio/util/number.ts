export interface FlipIntOptions {
  max?: number
  inclusiveMax?: boolean
}

export const flipInt = (
  value: number,
  { max = 0, inclusiveMax = false } = <FlipIntOptions>{}
) =>
  typeof value === "number" && !isFinite(value)
    ? 0
    : Number(
        (inclusiveMax ? value <= max : value < max) ? 4294967296 + value : value
      )
