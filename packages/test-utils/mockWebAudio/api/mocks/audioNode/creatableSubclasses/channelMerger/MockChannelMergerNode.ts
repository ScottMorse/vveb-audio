import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockChannelMergerNodeInternals } from "./MockChannelMergerNodeInternals"

export class MockChannelMergerNode
  extends MockAudioNode<MockChannelMergerNodeInternals>
  implements ChannelMergerNode
{
  constructor(context: BaseAudioContext, options?: ChannelMergerOptions) {
    super(context, options, new MockChannelMergerNodeInternals(context, options))
  }
}
