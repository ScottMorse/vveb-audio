/* eslint-disable jest/expect-expect */

describe("Sandbox", () => {
  test("Sample test", () => {
    // check availability of api with plain jsdom
    const props: (keyof typeof globalThis)[] = [
      "Worklet",
      "Audio",
      "AudioWorklet",
      "AudioWorkletNode",
      "MessagePort",
      "MessageEvent",
      "MediaStreamTrackEvent",
    ]
    const map: { [key: string]: unknown } = {}
    for (const prop of props) {
      map[prop] = globalThis[prop]
    }
    console.log(map)
  })
})
