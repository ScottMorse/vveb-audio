import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockConstantSourceNodeInternals } from "./MockConstantSourceNodeInternals"

export const createConstantSourceNodeMock = createMockFactory<
  typeof ConstantSourceNode,
  MockConstantSourceNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("ConstantSourceNode")
  class MockConstantSourceNode
    extends mockEnvironment.api.AudioScheduledSourceNode
    implements ConstantSourceNode
  {
    constructor(context: BaseAudioContext) {
      const args: MockAudioNodeArgs = [context]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockConstantSourceNodeInternals(this, mockEnvironment, context)
      )
    }

    get offset(): AudioParam {
      return getInternals(this).offset
    }
  }

  return MockConstantSourceNode
})
