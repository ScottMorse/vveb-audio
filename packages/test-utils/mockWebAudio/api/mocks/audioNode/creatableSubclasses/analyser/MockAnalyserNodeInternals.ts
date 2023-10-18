import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockAnalyserNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<AnalyserNode>
{
  get fftSize() {
    return this._fftSize
  }

  get frequencyBinCount() {
    return this._frequencyBinCount
  }

  getByteFrequencyData(_array: Uint8Array) {}

  getByteTimeDomainData(_array: Uint8Array) {}

  getFloatFrequencyData(_array: Float32Array) {}

  getFloatTimeDomainData(_array: Float32Array) {}

  get maxDecibels() {
    return this._maxDecibels
  }

  get minDecibels() {
    return this._minDecibels
  }

  get smoothingTimeConstant() {
    return this._smoothingTimeConstant
  }

  protected _fftSize = 2048

  protected _frequencyBinCount = 1024

  protected _maxDecibels = -30

  protected _minDecibels = -100

  protected _smoothingTimeConstant = 0.8

  protected _channelCount = 2
}
