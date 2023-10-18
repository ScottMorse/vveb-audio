import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockConvolverNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<ConvolverNode>
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
