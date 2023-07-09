import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioScheduledSourceNode } from "../../scheduledSource"
import { MockConstantSourceNodeInternals } from "./MockConstantSourceNodeInternals"

export class MockConstantSourceNode
  extends MockAudioScheduledSourceNode<MockConstantSourceNodeInternals>
  implements ConstantSourceNode
{
  constructor(context: BaseAudioContext) {
    super(context, new MockConstantSourceNodeInternals(context))
  }

  get offset() {
    return getInternals(this).offset
  }
}
