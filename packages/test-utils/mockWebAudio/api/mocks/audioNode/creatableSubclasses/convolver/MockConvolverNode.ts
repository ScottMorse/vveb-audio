import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockConvolverNodeInternals } from "./MockConvolverNodeInternals"

export const createConvolverNodeMock = createMockFactory<
  typeof ConvolverNode,
  MockConvolverNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("ConvolverNode")
  class MockConvolverNode
    extends mockEnvironment.api.AudioNode
    implements ConvolverNode
  {
    constructor(context: BaseAudioContext, options?: ConvolverOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockConvolverNodeInternals(this, mockEnvironment, context, options)
      )
    }

    get buffer(): AudioBuffer | null {
      return getInternals(this).buffer
    }

    get normalize(): boolean {
      return getInternals(this).normalize
    }
  }

  return MockConvolverNode
})
