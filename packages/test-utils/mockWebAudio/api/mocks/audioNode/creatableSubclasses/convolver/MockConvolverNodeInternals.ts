import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockConvolverNodeInternals
  extends MockAudioNodeInternals
  implements ConvolverNode
{
  get buffer() {
    return this._buffer
  }

  get normalize() {
    return this._normalize
  }

  protected _buffer: AudioBuffer | null = null

  protected _normalize = false

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
