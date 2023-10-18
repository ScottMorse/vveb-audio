import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockIIRFilterNodeInternals } from "./MockIIRFilterNodeInternals"

export const createIIRFilterNodeMock = createMockFactory<
  typeof IIRFilterNode,
  MockIIRFilterNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("IIRFilterNode")
  class MockIIRFilterNode
    extends mockEnvironment.api.AudioNode
    implements IIRFilterNode
  {
    constructor(context: BaseAudioContext, options?: IIRFilterOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockIIRFilterNodeInternals(this, mockEnvironment, context)
      )
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
  }

  return MockIIRFilterNode
})
