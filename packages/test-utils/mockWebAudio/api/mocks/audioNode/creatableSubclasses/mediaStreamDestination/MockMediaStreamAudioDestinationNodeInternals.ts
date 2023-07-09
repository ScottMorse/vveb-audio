import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockMediaStreamAudioDestinationNodeInternals
  extends MockAudioNodeInternals
  implements MediaStreamAudioDestinationNode
{
  get numberOfOutputs() {
    return 0
  }

  get stream() {
    return this._stream
  }

  protected _stream = new MediaStream()

  protected _channelCountMode = "explicit" as const

  protected _channelCount = 2
}
