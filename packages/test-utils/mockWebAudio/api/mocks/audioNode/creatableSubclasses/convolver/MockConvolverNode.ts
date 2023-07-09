import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockConvolverNodeInternals } from "./MockConvolverNodeInternals"

export class MockConvolverNode
  extends MockAudioNode<MockConvolverNodeInternals>
  implements ConvolverNode
{
  constructor(context: BaseAudioContext, options?: ConvolverOptions) {
    super(context, options, new MockConvolverNodeInternals(context, options))
  }

  get buffer() {
    return getInternals(this).buffer
  }

  get normalize() {
    return getInternals(this).normalize
  }
}
