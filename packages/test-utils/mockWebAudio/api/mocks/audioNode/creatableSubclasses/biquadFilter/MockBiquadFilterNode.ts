import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockBiquadFilterNodeInternals } from "./MockBiquadFilterNodeInternals"

export const createBiquadFilterNodeMock = createMockFactory<
  typeof BiquadFilterNode,
  MockBiquadFilterNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("BiquadFilterNode")
  class MockBiquadFilterNode
    extends mockEnvironment.api.AudioNode
    implements BiquadFilterNode
  {
    constructor(context: BaseAudioContext, options?: BiquadFilterOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockBiquadFilterNodeInternals(this, mockEnvironment, context)
      )
    }

    get detune(): AudioParam {
      return getInternals(this).detune
    }

    get frequency(): AudioParam {
      return getInternals(this).frequency
    }

    get gain(): AudioParam {
      return getInternals(this).gain
    }

    getFrequencyResponse(
      frequencyHz: Float32Array,
      magResponse: Float32Array,
      phaseResponse: Float32Array
    ) {
      return getInternals(this).getFrequencyResponse(
        frequencyHz,
        magResponse,
        phaseResponse
      )
    }

    get Q(): AudioParam {
      return getInternals(this).Q
    }

    get type(): BiquadFilterType {
      return getInternals(this).type
    }
  }

  return MockBiquadFilterNode
})
