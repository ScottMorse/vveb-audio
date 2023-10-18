import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockMediaStreamAudioDestinationNodeInternals } from "./MockMediaStreamAudioDestinationNodeInternals"

export const createMediaStreamAudioDestinationNodeMock = createMockFactory<
  typeof MediaStreamAudioDestinationNode,
  MockMediaStreamAudioDestinationNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("MediaStreamAudioDestinationNode")
  class MockMediaStreamAudioDestinationNode
    extends mockEnvironment.api.AudioNode
    implements MediaStreamAudioDestinationNode
  {
    constructor(context: BaseAudioContext, options?: AudioNodeOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockMediaStreamAudioDestinationNodeInternals(
          this,
          mockEnvironment,
          context
        )
      )
    }

    get stream(): MediaStream {
      return getInternals(this).stream
    }
  }

  return MockMediaStreamAudioDestinationNode
})
