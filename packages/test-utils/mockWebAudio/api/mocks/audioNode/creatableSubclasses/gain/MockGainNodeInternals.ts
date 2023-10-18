import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockGainNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<GainNode>
{
  get gain() {
    return this._gain
  }

  protected _gain = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Gain.gain",
    }
  )

  protected _channelCount = 2
}
