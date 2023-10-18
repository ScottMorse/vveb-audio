import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockMediaStreamAudioSourceNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<MediaStreamAudioSourceNode>
{
  constructor(
    mock: MediaStreamAudioSourceNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext,
    options: { mediaStream: MediaStream }
  ) {
    super(mock, mockEnvironment, context)
    this._mediaStream = options.mediaStream
  }

  get mediaStream() {
    return this._mediaStream
  }

  get numberOfInputs() {
    return 0
  }

  protected _mediaStream: MediaStream

  protected _channelCount = 2
}
