import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockChannelMergerNodeInternals } from "./MockChannelMergerNodeInternals"

export const createChannelMergerNodeMock = createMockFactory<
  typeof ChannelMergerNode,
  MockChannelMergerNodeInternals
>(({ setInternals, mockEnvironment }) => {
  @MockConstructorName("ChannelMergerNode")
  class MockChannelMergerNode
    extends mockEnvironment.api.AudioNode
    implements ChannelMergerNode
  {
    constructor(context: BaseAudioContext, options?: ChannelMergerOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockChannelMergerNodeInternals(this, mockEnvironment, context)
      )
    }
  }

  return MockChannelMergerNode
})
