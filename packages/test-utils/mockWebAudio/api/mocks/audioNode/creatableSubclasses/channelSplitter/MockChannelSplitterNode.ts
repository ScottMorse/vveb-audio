import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockChannelSplitterNodeInternals } from "./MockChannelSplitterNodeInternals"

export class MockChannelSplitterNode
  extends MockAudioNode<MockChannelSplitterNodeInternals>
  implements ChannelSplitterNode
{
  constructor(context: BaseAudioContext, options?: ChannelSplitterOptions) {
    super(context, options, new MockChannelSplitterNodeInternals(context, options))
  }
}
