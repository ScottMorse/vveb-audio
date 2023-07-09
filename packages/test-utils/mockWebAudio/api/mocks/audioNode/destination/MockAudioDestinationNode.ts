import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { EngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockAudioNode } from "../base/MockAudioNode"
import { MockAudioDestinationNodeInternals } from "./MockAudioDestinationNodeInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export class MockAudioDestinationNode
  extends MockAudioNode<MockAudioDestinationNodeInternals>
  implements AudioDestinationNode
{
  constructor(context: BaseAudioContext, _allow?: typeof ALLOW_CONSTRUCTOR) {
    super(context, {}, new MockAudioDestinationNodeInternals(context))
    if (_allow !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
  }

  get maxChannelCount() {
    return getInternals(this).maxChannelCount
  }
}

export const createMockAudioDestinationNode = (
  engineContext: EngineContext,
  context: BaseAudioContext
) =>
  new (engineContext.mockApi
    .AudioDestinationNode)(
    context,
    ALLOW_CONSTRUCTOR
  )
