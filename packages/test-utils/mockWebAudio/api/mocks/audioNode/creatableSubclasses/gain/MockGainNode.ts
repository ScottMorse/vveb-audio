import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock";
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode";
import { MockGainNodeInternals } from "./MockGainNodeInternals";

export class MockGainNode extends MockAudioNode<MockGainNodeInternals> implements GainNode {
  constructor(context: BaseAudioContext, options?: GainOptions) {
    super(context, options, new MockGainNodeInternals(context, options));
  }

  get gain() {
    return getInternals(this).gain;
  }
}
