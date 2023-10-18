import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockStereoPannerNodeInternals } from "./MockStereoPannerNodeInternals"

export const createStereoPannerNodeMock = createMockFactory<
  typeof StereoPannerNode,
  MockStereoPannerNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("StereoPannerNode")
  class MockStereoPannerNode
    extends mockEnvironment.api.AudioNode
    implements StereoPannerNode
  {
    constructor(context: BaseAudioContext, options?: StereoPannerOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockStereoPannerNodeInternals(this, mockEnvironment, context)
      )
    }

    get pan(): AudioParam {
      return getInternals(this).pan
    }
  }

  return MockStereoPannerNode
})
