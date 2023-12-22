import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockStereoPannerNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<StereoPannerNode>
{
  get pan() {
    return this._pan
  }

  protected _pan = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      minValue: -1,
      name: "StereoPanner.pan",
    }
  )

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
