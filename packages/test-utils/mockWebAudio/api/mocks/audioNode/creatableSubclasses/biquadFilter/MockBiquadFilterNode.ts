import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockBiquadFilterNodeInternals } from "./MockBiquadFilterNodeInternals"

export class MockBiquadFilterNode
  extends MockAudioNode<MockBiquadFilterNodeInternals>
  implements BiquadFilterNode
{
  constructor(context: BaseAudioContext, options?: BiquadFilterOptions) {
    super(context, options, new MockBiquadFilterNodeInternals(context, options))
  }

  get detune() {
    return getInternals(this).detune
  }

  get frequency() {
    return getInternals(this).frequency
  }

  get gain() {
    return getInternals(this).gain
  }

  getFrequencyResponse(
    frequencyHz: Float32Array,
    magResponse: Float32Array,
    phaseResponse: Float32Array
  ) {
    return getInternals(this).getFrequencyResponse(
      frequencyHz,
      magResponse,
      phaseResponse
    )
  }

  get Q() {
    return getInternals(this).Q
  }

  get type() {
    return getInternals(this).type
  }
}
