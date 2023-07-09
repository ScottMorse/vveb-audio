import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockIIRFilterNodeInternals
  extends MockAudioNodeInternals
  implements IIRFilterNode
{
  getFrequencyResponse(
    _frequencyHz: Float32Array,
    _magResponse: Float32Array,
    _phaseResponse: Float32Array
  ): void {}

  protected _channelCount = 2
}
