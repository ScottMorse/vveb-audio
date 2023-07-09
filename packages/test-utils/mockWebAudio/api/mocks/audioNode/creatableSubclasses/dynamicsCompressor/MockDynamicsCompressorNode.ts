import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockDynamicsCompressorNodeInternals } from "./MockDynamicsCompressorNodeInternals"

export class MockDynamicsCompressorNode
  extends MockAudioNode<MockDynamicsCompressorNodeInternals>
  implements DynamicsCompressorNode
{
  constructor(context: BaseAudioContext, options?: DynamicsCompressorOptions) {
    super(context, options, new MockDynamicsCompressorNodeInternals(context, options))
  }

  get attack() {
    return getInternals(this).attack
  }

  get knee() {
    return getInternals(this).knee
  }

  get ratio() {
    return getInternals(this).ratio
  }

  get reduction() {
    return getInternals(this).reduction
  }

  get release() {
    return getInternals(this).release
  }

  get threshold() {
    return getInternals(this).threshold
  }
}
