import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../base/MockAudioNodeInternals"

export class MockAudioDestinationNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<AudioDestinationNode>
{
  constructor(
    mock: AudioDestinationNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext
  ) {
    super(mock, mockEnvironment, context)
  }

  get maxChannelCount() {
    return this.mockEnvironment.deviceSettings.destinationMaxChannelCount
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
