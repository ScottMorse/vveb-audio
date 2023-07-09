import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockAudioBufferSourceNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements AudioBufferSourceNode
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
    getEngineContext(this),
    this.context,
    {
      defaultValue: 0,
    }
  )

  protected _loop = false

  protected _loopEnd = 0

  protected _loopStart = 0

  protected _playbackRate = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      automationRate: "k-rate",
    }
  )

  protected _channelCount = 2
}
