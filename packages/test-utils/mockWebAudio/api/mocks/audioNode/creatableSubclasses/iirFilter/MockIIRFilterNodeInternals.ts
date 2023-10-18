import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockIIRFilterNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<IIRFilterNode>
{
  getFrequencyResponse(
    _frequencyHz: Float32Array,
    _magResponse: Float32Array,
    _phaseResponse: Float32Array
  ): void {}

  protected _channelCount = 2
}
