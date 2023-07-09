import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockDelayNodeInternals
  extends MockAudioNodeInternals
  implements DelayNode
{
  get delayTime() {
    return this._delayTime
  }

  protected _delayTime = createMockAudioParam(
    getEngineContext(this),
    this.context
  )

  protected _channelCount = 2
}
