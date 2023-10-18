import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../../mockFactory"
import { MockAudioContextInternals } from "./MockAudioContextInternals"

export const createAudioContextMock = createMockFactory<
  typeof AudioContext,
  MockAudioContextInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioContext")
  class MockAudioContext
    extends mockEnvironment.api.BaseAudioContext
    implements AudioContext
  {
    constructor(options?: AudioContextOptions) {
      super()

      setInternals(
        this,
        new MockAudioContextInternals(this, mockEnvironment, options)
      )
    }

    get baseLatency(): number {
      return getInternals(this).baseLatency
    }

    close() {
      return getInternals(this).close()
    }

    createMediaElementSource(
      mediaElement: HTMLMediaElement
    ): MediaElementAudioSourceNode {
      return getInternals(this).createMediaElementSource(mediaElement)
    }

    createMediaStreamDestination(): MediaStreamAudioDestinationNode {
      return getInternals(this).createMediaStreamDestination()
    }

    createMediaStreamSource(
      mediaStream: MediaStream
    ): MediaStreamAudioSourceNode {
      return getInternals(this).createMediaStreamSource(mediaStream)
    }

    getOutputTimestamp(): AudioTimestamp {
      return getInternals(this).getOutputTimestamp()
    }

    get outputLatency(): number {
      return getInternals(this).outputLatency
    }

    resume() {
      return getInternals(this).resume()
    }

    suspend() {
      return getInternals(this).suspend()
    }
  }

  return MockAudioContext
})
