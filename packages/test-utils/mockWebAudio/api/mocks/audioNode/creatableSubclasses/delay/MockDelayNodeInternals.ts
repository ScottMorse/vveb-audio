import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockDelayNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<DelayNode>
{
  get delayTime() {
    return this._delayTime
  }

  protected _delayTime = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      name: "Delay.delayTime",
    }
  )

  protected _channelCount = 2
}
