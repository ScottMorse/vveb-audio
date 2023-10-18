import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockWaveShaperNodeInternals } from "./MockWaveShaperNodeInternals"

export const createWaveShaperNodeMock = createMockFactory<
  typeof WaveShaperNode,
  MockWaveShaperNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("WaveShaperNode")
  class MockWaveShaperNode
    extends mockEnvironment.api.AudioNode
    implements WaveShaperNode
  {
    constructor(context: BaseAudioContext, options?: WaveShaperOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockWaveShaperNodeInternals(this, mockEnvironment, context)
      )
    }

    get curve(): Float32Array | null {
      return getInternals(this).curve
    }

    get oversample(): OverSampleType {
      return getInternals(this).oversample
    }
  }

  return MockWaveShaperNode
})
