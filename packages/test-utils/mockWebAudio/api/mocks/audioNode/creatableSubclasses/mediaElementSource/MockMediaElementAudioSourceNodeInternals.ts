import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"

export class MockMediaElementAudioSourceNodeInternals
  extends MockAudioNodeInternals
  implements MediaElementAudioSourceNode
{
  constructor(
    context: BaseAudioContext,
    options: MediaElementAudioSourceOptions
  ) {
    super(context)
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
