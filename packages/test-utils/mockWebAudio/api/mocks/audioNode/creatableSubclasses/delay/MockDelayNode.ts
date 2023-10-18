import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockDelayNodeInternals } from "./MockDelayNodeInternals"

export const createDelayNodeMock = createMockFactory<
  typeof DelayNode,
  MockDelayNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("DelayNode")
  class MockDelayNode
    extends mockEnvironment.api.AudioNode
    implements DelayNode
  {
    constructor(context: BaseAudioContext, options?: DelayOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockDelayNodeInternals(this, mockEnvironment, context, options)
      )
    }

    get delayTime(): AudioParam {
      return getInternals(this).delayTime
    }
  }

  return MockDelayNode
})
