import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockAudioBufferSourceNodeInternals } from "./MockAudioBufferSourceNodeInternals"

export const createAudioBufferSourceNodeMock = createMockFactory<
  typeof AudioBufferSourceNode,
  MockAudioBufferSourceNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioBufferSourceNode")
  class MockAudioBufferSourceNode
    extends mockEnvironment.api.AudioScheduledSourceNode
    implements AudioBufferSourceNode
  {
    constructor(context: BaseAudioContext) {
      const args: MockAudioNodeArgs = [context]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockAudioBufferSourceNodeInternals(this, mockEnvironment, context)
      )
    }

    get buffer(): AudioBuffer | null {
      return getInternals(this).buffer
    }

    get detune(): AudioParam {
      return getInternals(this).detune
    }

    get loop(): boolean {
      return getInternals(this).loop
    }

    get loopEnd(): number {
      return getInternals(this).loopEnd
    }

    get loopStart(): number {
      return getInternals(this).loopStart
    }

    get onended(): ((this: AudioScheduledSourceNode, ev: Event) => any) | null {
      return getInternals(this).onended
    }

    set onended(
      value: ((this: AudioScheduledSourceNode, ev: Event) => any) | null
    ) {
      getInternals(this).onended = value
    }

    get playbackRate(): AudioParam {
      return getInternals(this).playbackRate
    }

    start(when?: number, offset?: number, duration?: number) {
      return getInternals(this).start(when, offset, duration)
    }

    stop(when?: number) {
      return getInternals(this).stop(when)
    }
  }

  return MockAudioBufferSourceNode
})
