import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockGainNodeInternals } from "./MockGainNodeInternals"

export const createGainNodeMock = createMockFactory<
  typeof GainNode,
  MockGainNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("GainNode")
  class MockGainNode extends mockEnvironment.api.AudioNode implements GainNode {
    constructor(context: BaseAudioContext, options?: GainOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockGainNodeInternals(this, mockEnvironment, context, options)
      )
    }

    get gain(): AudioParam {
      return getInternals(this).gain
    }
  }

  return MockGainNode
})
