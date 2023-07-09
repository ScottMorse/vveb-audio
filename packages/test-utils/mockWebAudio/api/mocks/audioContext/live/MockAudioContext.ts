import {
  getInternals,
  MockConstructorName,
} from "@@test-utils/mockWebAudio/api/baseMock"
import { MockBaseAudioContext } from "../base"
import { MockAudioContextInternals } from "./MockAudioContextInternals"

@MockConstructorName("AudioContext")
export class MockAudioContext
  extends MockBaseAudioContext<MockAudioContextInternals>
  implements AudioContext
{
  constructor(options?: AudioContextOptions) {
    super(new MockAudioContextInternals(options))
  }

  get baseLatency() {
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

  get outputLatency() {
    return getInternals(this).outputLatency
  }

  resume() {
    return getInternals(this).resume()
  }

  suspend() {
    return getInternals(this).suspend()
  }
}
