import { MockEnvironment, MockInternals } from "../../mockFactory"

/** @todo flesh out mock with registerable audio worklet processors */
export class MockAudioParamMapInternals
  extends MockInternals<AudioParamMap>
  implements AudioParamMap
{
  constructor(mock: AudioParamMap, mockEnvironment: MockEnvironment) {
    super(mock, mockEnvironment)
  }

  [Symbol.iterator]() {
    return this
  }

  entries() {
    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        return { done: true as const, value: undefined }
      },
    }
  }

  forEach(
    _callbackfn: (value: AudioParam, key: string, map: AudioParamMap) => void,
    _thisArg?: any
  ) {
    return undefined
  }

  get(_key: string) {
    return undefined
  }

  has(_key: string) {
    return false
  }

  keys() {
    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        return { done: true as const, value: undefined }
      },
    }
  }

  next() {
    return { done: true as const, value: undefined }
  }

  get size() {
    return this._size
  }

  values() {
    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        return { done: true as const, value: undefined }
      },
    }
  }

  protected _size = 0
}
