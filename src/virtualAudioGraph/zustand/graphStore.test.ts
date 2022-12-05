import { createGraphStore } from "./graphStore"

describe("Test audio graph store", () => {
  test("Sandbox tests", () => {
    const { getGraph, getNodes, getNode, subscribe, destroy } =
      createGraphStore({
        root: {
          name: "gain",
          options: {
            gain: 0.5,
          },
        },
      })

    expect(getNodes().length).toBe(1)
  })
})
