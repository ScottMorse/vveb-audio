import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockChannelSplitterNodeInternals } from "./MockChannelSplitterNodeInternals"

export const createChannelSplitterNodeMock = createMockFactory<
  typeof ChannelSplitterNode,
  MockChannelSplitterNodeInternals
>(({ setInternals, mockEnvironment }) => {
  @MockConstructorName("ChannelSplitterNode")
  class MockChannelSplitterNode
    extends mockEnvironment.api.AudioNode
    implements ChannelSplitterNode
  {
    constructor(context: BaseAudioContext, options?: ChannelSplitterOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockChannelSplitterNodeInternals(this, mockEnvironment, context)
      )
    }
  }

  return MockChannelSplitterNode
})
