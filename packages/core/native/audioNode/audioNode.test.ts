import { createAudioNode } from "./createAudioNode"

const ctx = new AudioContext()

describe("Native Web Audio AudioNode", () => {
  test("Creating an AudioNode", () => {
    expect(createAudioNode("audioBufferSource", ctx, {})).toBeInstanceOf(
      AudioBufferSourceNode
    )
  })
})
