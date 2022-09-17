import message from "."

describe("Dummy test", () => {
  test("Tests work", () => {
    throw new Error("Test failure")
    expect(message).toBe("I VVANT TO CREATE AN AUDIO PROCESSING GRAPH")
  })
})
