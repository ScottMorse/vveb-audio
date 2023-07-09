import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockStereoPannerNodeInternals } from "./MockStereoPannerNodeInternals"

export class MockStereoPannerNode
  extends MockAudioNode<MockStereoPannerNodeInternals>
  implements StereoPannerNode
{
  constructor(context: BaseAudioContext, options?: StereoPannerOptions) {
    super(context, options, new MockStereoPannerNodeInternals(context, options))
  }

  get pan() {
    return getInternals(this).pan
  }
}
