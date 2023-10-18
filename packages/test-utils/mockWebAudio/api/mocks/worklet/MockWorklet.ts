import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory, MockInternals } from "../../mockFactory"

export const ALLOW_WORKLET_CONSTRUCTOR = Symbol("ALLOW_WORKLET_CONSTRUCTOR")

class MockWorkletInternals extends MockInternals<Worklet> implements Worklet {
  addModule(_moduleURL: string | URL, _options?: WorkletOptions | undefined) {
    return Promise.resolve()
  }
}

export const createWorkletMock = createMockFactory<
  typeof Worklet,
  MockWorkletInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("Worklet")
  class MockWorklet implements Worklet {
    constructor(_allow?: typeof ALLOW_WORKLET_CONSTRUCTOR) {
      if (_allow !== ALLOW_WORKLET_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }
      setInternals(this, new MockWorkletInternals(this, mockEnvironment))
    }

    addModule(_moduleURL: string | URL, _options?: WorkletOptions | undefined) {
      return getInternals(this).addModule(_moduleURL, _options)
    }
  }

  return MockWorklet
})
