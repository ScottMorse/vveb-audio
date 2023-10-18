import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockDynamicsCompressorNodeInternals } from "./MockDynamicsCompressorNodeInternals"

export const createDynamicsCompressorNodeMock = createMockFactory<
  typeof DynamicsCompressorNode,
  MockDynamicsCompressorNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("DynamicsCompressorNode")
  class MockDynamicsCompressorNode
    extends mockEnvironment.api.AudioNode
    implements DynamicsCompressorNode
  {
    constructor(
      context: BaseAudioContext,
      options?: DynamicsCompressorOptions
    ) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockDynamicsCompressorNodeInternals(
          this,
          mockEnvironment,
          context,
          options
        )
      )
    }

    get attack(): AudioParam {
      return getInternals(this).attack
    }

    get knee(): AudioParam {
      return getInternals(this).knee
    }

    get ratio(): AudioParam {
      return getInternals(this).ratio
    }

    get reduction(): number {
      return getInternals(this).reduction
    }

    get release(): AudioParam {
      return getInternals(this).release
    }

    get threshold(): AudioParam {
      return getInternals(this).threshold
    }
  }

  return MockDynamicsCompressorNode
})
