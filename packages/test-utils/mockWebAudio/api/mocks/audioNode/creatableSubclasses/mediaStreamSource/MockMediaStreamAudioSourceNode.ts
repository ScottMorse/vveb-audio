import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockMediaStreamAudioSourceNodeInternals } from "./MockMediaStreamAudioSourceNodeInternals"

export const createMediaStreamAudioSourceNodeMock = createMockFactory<
  typeof MediaStreamAudioSourceNode,
  MockMediaStreamAudioSourceNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("MediaStreamAudioSourceNode")
  class MockMediaStreamAudioSourceNode
    extends mockEnvironment.api.AudioNode
    implements MediaStreamAudioSourceNode
  {
    constructor(
      context: BaseAudioContext,
      options: { mediaStream: MediaStream }
    ) {
      const args: MockAudioNodeArgs = [context, options as AudioNodeOptions]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockMediaStreamAudioSourceNodeInternals(
          this,
          mockEnvironment,
          context,
          options
        )
      )
    }

    get mediaStream(): MediaStream {
      return getInternals(this).mediaStream
    }
  }

  return MockMediaStreamAudioSourceNode
})
