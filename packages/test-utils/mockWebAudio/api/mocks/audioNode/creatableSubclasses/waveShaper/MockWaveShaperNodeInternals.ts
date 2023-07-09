import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockWaveShaperNodeInternals
  extends MockAudioNodeInternals
  implements WaveShaperNode
{
  get curve() {
    return this._curve
  }

  get oversample() {
    return this._oversample
  }

  protected _curve: Float32Array | null = null

  protected _oversample: OverSampleType = "none"
}
