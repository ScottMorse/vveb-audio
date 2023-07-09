import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockDelayNodeInternals } from "./MockDelayNodeInternals"

export class MockDelayNode
  extends MockAudioNode<MockDelayNodeInternals>
  implements DelayNode
{
  constructor(context: BaseAudioContext, maxDelayTime?: number) {
    super(context, {maxDelayTime}, new MockDelayNodeInternals(context, maxDelayTime))
  }

  get delayTime() {
    return getInternals(this).delayTime
  }
}
