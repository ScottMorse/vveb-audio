import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockChannelSplitterNodeInternals
  extends MockAudioNodeInternals
  implements ChannelSplitterNode
{
  get numberOfOutputs() {
    return 6
  }

  protected _channelCountMode = "explicit" as const

  protected _channelInterpretation = "discrete" as const

  protected _channelCount = 6
}
