import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockAudioNodeInternals } from "../base/MockAudioNodeInternals"

export class MockAudioDestinationNodeInternals
  extends MockAudioNodeInternals
  implements AudioDestinationNode
{
  constructor(context: BaseAudioContext) {
    super(context)
  }

  get maxChannelCount() {
    return getEngineContext(this).deviceSettings.maxChannels
  }

  get numberOfInputs() {
    return 1
  }

  get numberOfOutputs() {
    return 0
  }

  protected _channelCountMode: ChannelCountMode = "explicit"

  protected _channelInterpretation: ChannelInterpretation = "speakers"

  protected _channelCount = 2
}
