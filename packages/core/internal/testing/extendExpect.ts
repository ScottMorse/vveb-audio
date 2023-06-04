import { almostEqual } from "../util/number/almostEqual"

const toAlmostEqual =
  (received: number) => (target: number, threshold: number) => {
    const pass = almostEqual(received, target, threshold)
    return {
      message: () =>
        `expected ${received} (received) to almost equal ${target} ${
          typeof threshold === "number"
            ? `within the threshold ${threshold}`
            : ""
        } (difference: ${target - received})`,
      pass,
    }
  }

export type ToAlmostEqualMatcher = ReturnType<typeof toAlmostEqual>

expect.extend({
  toAlmostEqual<Received extends number>(
    received: Received,
    target: number,
    precision: number
  ) {
    return toAlmostEqual(received)(target, precision)
  },
})
