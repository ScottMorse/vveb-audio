import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockAudioBufferSourceNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements OmitEventTarget<AudioBufferSourceNode>
{
  get buffer() {
    return this._buffer
  }

  get channelCount() {
    return this._channelCount
  }

  get detune() {
    return this._detune
  }

  get loop() {
    return this._loop
  }

  get loopEnd() {
    return this._loopEnd
  }

  get loopStart() {
    return this._loopStart
  }

  get numberOfInputs() {
    return 0
  }

  get playbackRate() {
    return this._playbackRate
  }

  start(_when?: number, _offset?: number, _duration?: number) {}

  protected _buffer: AudioBuffer | null = null

  protected _detune = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 0,
      name: "AudioBufferSource.detune",
    }
  )

  protected _loop = false

  protected _loopEnd = 0

  protected _loopStart = 0

  protected _playbackRate = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      automationRate: "k-rate",
      name: "AudioBufferSource.playbackRate",
    }
  )

  protected _channelCount = 2
}
