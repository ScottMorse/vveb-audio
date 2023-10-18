import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockChannelMergerNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<ChannelMergerNode>
{
  get numberOfInputs() {
    return 6
  }

  protected _channelCountMode = "explicit" as const
}
