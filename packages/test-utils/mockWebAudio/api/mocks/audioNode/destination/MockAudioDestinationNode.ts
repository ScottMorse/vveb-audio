import {
  createMockFactory,
  MockWebAudioApi,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioDestinationNodeInternals } from "./MockAudioDestinationNodeInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createAudioDestinationNodeMock = createMockFactory<
  typeof AudioDestinationNode,
  MockAudioDestinationNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioDestinationNode")
  class MockAudioDestinationNode
    extends mockEnvironment.api.AudioNode
    implements AudioDestinationNode
  {
    constructor(context: BaseAudioContext, _allow?: typeof ALLOW_CONSTRUCTOR) {
      /**@todo better type all special mock constructor parameters */
      super(...([context] as unknown as []))

      if (_allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }

      setInternals(
        this,
        new MockAudioDestinationNodeInternals(this, mockEnvironment, context)
      )
    }

    get maxChannelCount(): number {
      return getInternals(this).maxChannelCount
    }
  }

  return MockAudioDestinationNode as typeof AudioDestinationNode
})

export const createMockAudioDestinationNode = (
  api: MockWebAudioApi,
  context: BaseAudioContext
) =>
  new api.AudioDestinationNode(
    /**@todo better type all special mock constructor parameters */
    ...([context, ALLOW_CONSTRUCTOR] as unknown as [])
  )
