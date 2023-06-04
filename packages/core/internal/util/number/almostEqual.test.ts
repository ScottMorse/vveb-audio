import { almostEqual } from "./almostEqual"

describe("Test almostEqual", () => {
  test("Expected results", () => {
    expect(almostEqual(1, 1, 0)).toBe(true)
    expect(almostEqual(1, 1, 1)).toBe(true)
    expect(almostEqual(1, 1, -1)).toBe(true)
    expect(almostEqual(1, 2, 0)).toBe(false)
    expect(almostEqual(1, 1.5, 0)).toBe(false)
    expect(almostEqual(1, 1.5, 0.5)).toBe(true)
    expect(almostEqual(1, 1.5, 0.5, false)).toBe(false)
    expect(almostEqual(1, 1.001, 0.005)).toBe(true)
    expect(almostEqual(100, -100, -200)).toBe(true)
    expect(almostEqual(100, 50, 25)).toBe(false)
    expect(almostEqual(100, -100, -200, false)).toBe(false)
    expect(almostEqual(-10_000, -10_001, 2)).toBe(true)
    expect(almostEqual(-10_000, -10_001, 0.9)).toBe(false)
  })
})
