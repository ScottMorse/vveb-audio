import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock";
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode";
import { MockIIRFilterNodeInternals } from "./MockIIRFilterNodeInternals";

export class MockIIRFilterNode extends MockAudioNode<MockIIRFilterNodeInternals> implements IIRFilterNode {
  constructor(context: BaseAudioContext, options?: IIRFilterOptions) {
    super(context, options, new MockIIRFilterNodeInternals(context, options));
  }

  getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
    return getInternals(this).getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
}
