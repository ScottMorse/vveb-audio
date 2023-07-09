import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockChannelMergerNodeInternals
  extends MockAudioNodeInternals
  implements ChannelMergerNode
{
  get numberOfInputs() {
    return 6
  }

  protected _channelCountMode = "explicit" as const
}
