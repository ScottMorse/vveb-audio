import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockWaveShaperNodeInternals } from "./MockWaveShaperNodeInternals"

export class MockWaveShaperNode extends MockAudioNode<MockWaveShaperNodeInternals> implements WaveShaperNode {
  constructor(context: BaseAudioContext, options?: WaveShaperOptions) {
    super(context, options, new MockWaveShaperNodeInternals(context, options))
  }

  get curve() {
    return getInternals(this).curve
  }

  get oversample() {
    return getInternals(this).oversample
  }
}
