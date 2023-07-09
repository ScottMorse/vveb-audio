import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockStereoPannerNodeInternals
  extends MockAudioNodeInternals
  implements StereoPannerNode
{
  get pan() {
    return this._pan
  }

  protected _pan = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -1,
    }
  )

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
