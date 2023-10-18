import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../base"
import { MockAudioScheduledSourceNodeInternals } from "./MockAudioScheduledSourceNodeInternals"

export type MockAudioScheduledSourceNodeArgs = [
  BaseAudioContext,
  AudioNodeOptions?
]

export const createAudioScheduledSourceNodeMock = createMockFactory<
  typeof AudioScheduledSourceNode,
  MockAudioScheduledSourceNodeInternals
>(({ getInternals, setInternals, mockEnvironment }) => {
  @MockConstructorName("AudioScheduledSourceNode")
  class MockAudioScheduledSourceNode
    extends mockEnvironment.api.AudioNode
    implements AudioScheduledSourceNode
  {
    constructor(context: BaseAudioContext, options?: AudioNodeOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))

      setInternals(
        this,
        new MockAudioScheduledSourceNodeInternals(
          this,
          mockEnvironment,
          context
        )
      )
    }

    get onended(): ((this: AudioScheduledSourceNode, ev: Event) => any) | null {
      return getInternals(this).onended
    }

    set onended(value) {
      getInternals(this).onended = value
    }

    start(when?: number) {
      getInternals(this).start(when)
    }

    stop(when?: number) {
      getInternals(this).stop(when)
    }
  }

  return MockAudioScheduledSourceNode as typeof AudioScheduledSourceNode
})
