import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockChannelSplitterNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<ChannelSplitterNode>
{
  get numberOfOutputs() {
    return 6
  }

  protected _channelCountMode = "explicit" as const

  protected _channelInterpretation = "discrete" as const

  protected _channelCount = 6
}
