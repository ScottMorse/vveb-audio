import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioWorkletNodeInternals } from "./MockAudioWorkletNodeInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createAudioWorkletNodeMock = createMockFactory<
  typeof AudioWorkletNode,
  MockAudioWorkletNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioWorkletNode")
  class MockAudioWorkletNode
    extends mockEnvironment.api.AudioNode
    implements AudioWorkletNode
  {
    constructor(context: BaseAudioContext, _allow?: typeof ALLOW_CONSTRUCTOR) {
      /**@todo better type all special mock constructor parameters */
      super(...([context] as unknown as []))

      if (_allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }

      setInternals(
        this,
        new MockAudioWorkletNodeInternals(this, mockEnvironment, context)
      )
    }

    get onprocessorerror():
      | ((this: AudioWorkletNode, ev: Event) => any)
      | null {
      return getInternals(this).onprocessorerror
    }

    set onprocessorerror(
      value: ((this: AudioWorkletNode, ev: Event) => any) | null
    ) {
      getInternals(this).onprocessorerror = value
    }

    get parameters(): AudioParamMap {
      return getInternals(this).parameters
    }

    get port(): MessagePort {
      return getInternals(this).port
    }
  }

  return MockAudioWorkletNode as unknown as typeof AudioWorkletNode
})
