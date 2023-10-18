import { MockEnvironment, createMockFactory } from "../../mockFactory"
import { MockAudioParamMapInternals } from "./MockAudioParamMapInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createAudioParamMapMock = createMockFactory<
  typeof AudioParamMap,
  MockAudioParamMapInternals
>(({ getInternals, setInternals, mockEnvironment }) => {
  class MockAudioParamMap implements AudioParamMap {
    constructor(_allow?: typeof ALLOW_CONSTRUCTOR) {
      if (_allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }
      setInternals(this, new MockAudioParamMapInternals(this, mockEnvironment))
    }

    [Symbol.iterator]() {
      return getInternals(this)[Symbol.iterator]()
    }

    entries() {
      return getInternals(this).entries()
    }

    forEach(
      callbackfn: (value: AudioParam, key: string, map: AudioParamMap) => void,
      thisArg?: any
    ) {
      return getInternals(this).forEach(callbackfn, thisArg)
    }

    get(key: string) {
      return getInternals(this).get(key)
    }

    has(key: string) {
      return getInternals(this).has(key)
    }

    keys() {
      return getInternals(this).keys()
    }

    get size(): number {
      return getInternals(this).size
    }

    values() {
      return getInternals(this).values()
    }
  }

  return MockAudioParamMap
})

export const createMockAudioParamMap = (mockEnvironment: MockEnvironment) => {
  return new mockEnvironment.api.AudioParamMap(
    ...([ALLOW_CONSTRUCTOR] as unknown as [])
  )
}
