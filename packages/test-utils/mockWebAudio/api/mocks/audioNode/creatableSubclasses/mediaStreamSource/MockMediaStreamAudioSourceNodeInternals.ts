import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockMediaStreamAudioSourceNodeInternals
  extends MockAudioNodeInternals
  implements MediaStreamAudioSourceNode
{
  constructor(
    context: BaseAudioContext,
    options: { mediaStream: MediaStream }
  ) {
    super(context)
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
