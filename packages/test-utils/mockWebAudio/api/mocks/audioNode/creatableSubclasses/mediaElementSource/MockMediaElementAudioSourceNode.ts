import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockMediaElementAudioSourceNodeInternals } from "./MockMediaElementAudioSourceNodeInternals"

export const createMediaElementAudioSourceNodeMock = createMockFactory<
  typeof MediaElementAudioSourceNode,
  MockMediaElementAudioSourceNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("MediaElementAudioSourceNode")
  class MockMediaElementAudioSourceNode
    extends mockEnvironment.api.AudioNode
    implements MediaElementAudioSourceNode
  {
    constructor(
      context: BaseAudioContext,
      options: MediaElementAudioSourceOptions
    ) {
      const args: MockAudioNodeArgs = [context, options as AudioNodeOptions]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockMediaElementAudioSourceNodeInternals(
          this,
          mockEnvironment,
          context,
          options
        )
      )
    }

    get mediaElement(): HTMLMediaElement {
      return getInternals(this).mediaElement
    }
  }

  return MockMediaElementAudioSourceNode
})
