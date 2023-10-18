import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { createMockMediaStreamTrack } from "../../../mediaStream/track"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockMediaStreamAudioDestinationNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<MediaStreamAudioDestinationNode>
{
  get numberOfOutputs() {
    return 0
  }

  get stream() {
    return this._stream
  }

  protected _stream = new this.mockEnvironment.api.MediaStream([
    createMockMediaStreamTrack(this.mockEnvironment.api, {
      kind: "audio",
      label: "MediaStreamAudioDestinationNode",
    }),
  ])

  protected _channelCountMode = "explicit" as const

  protected _channelCount = 2
}
