import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockWaveShaperNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<WaveShaperNode>
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
