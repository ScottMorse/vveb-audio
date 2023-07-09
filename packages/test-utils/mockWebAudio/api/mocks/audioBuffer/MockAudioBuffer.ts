import { BaseMock, getInternals, MockConstructorName } from "../../baseMock"
import { MockAudioBufferInternals } from "./MockAudioBufferInternals"

@MockConstructorName("AudioBuffer")
export class MockAudioBuffer
  extends BaseMock<MockAudioBufferInternals>
  implements AudioBuffer
{
  constructor(options: AudioBufferOptions) {
    super(new MockAudioBufferInternals(options))
  }

  copyFromChannel(
    destination: Float32Array,
    channelNumber: number,
    startInChannel?: number
  ) {
    return getInternals(this).copyFromChannel(
      destination,
      channelNumber,
      startInChannel
    )
  }

  copyToChannel(
    source: Float32Array,
    channelNumber: number,
    startInChannel?: number
  ) {
    return getInternals(this).copyToChannel(
      source,
      channelNumber,
      startInChannel
    )
  }

  get duration() {
    return getInternals(this).duration
  }

  getChannelData(channel: number) {
    return getInternals(this).getChannelData(channel)
  }

  get length() {
    return getInternals(this).length
  }

  get numberOfChannels() {
    return getInternals(this).numberOfChannels
  }

  get sampleRate() {
    return getInternals(this).sampleRate
  }
}
