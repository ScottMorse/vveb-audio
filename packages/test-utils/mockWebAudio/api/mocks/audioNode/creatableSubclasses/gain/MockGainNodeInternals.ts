import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockGainNodeInternals
  extends MockAudioNodeInternals
  implements GainNode
{
  get gain() {
    return this._gain
  }

  protected _gain = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _channelCount = 2
}
