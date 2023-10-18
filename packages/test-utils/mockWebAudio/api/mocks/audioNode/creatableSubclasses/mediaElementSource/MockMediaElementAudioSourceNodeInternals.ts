import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockMediaElementAudioSourceNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<MediaElementAudioSourceNode>
{
  constructor(
    mock: MediaElementAudioSourceNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext,
    options: MediaElementAudioSourceOptions
  ) {
    super(mock, mockEnvironment, context)
    this._mediaElement = options?.mediaElement
  }

  get mediaElement() {
    return this._mediaElement
  }

  get numberOfInputs() {
    return 0
  }

  protected _mediaElement: HTMLMediaElement

  protected _channelCount = 2
}
