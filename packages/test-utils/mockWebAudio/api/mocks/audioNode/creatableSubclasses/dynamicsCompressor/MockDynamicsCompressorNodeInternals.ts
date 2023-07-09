
import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockDynamicsCompressorNodeInternals
  extends MockAudioNodeInternals
  implements DynamicsCompressorNode
{
  get attack() {
    return this._attack
  }

  get channelCount() {
    return this._channelCount
  }

  get channelCountMode() {
    return this._channelCountMode
  }

  get knee() {
    return this._knee
  }

  get ratio() {
    return this._ratio
  }

  get reduction() {
    return this._reduction
  }

  get release() {
    return this._release
  }

  get threshold() {
    return this._threshold
  }

  protected _attack = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 0.003000000026077032,
      automationRate: "k-rate",
    }
  )

  protected _knee = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 30,
      maxValue: 40,
      automationRate: "k-rate",
    }
  )

  protected _ratio = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 12,
      minValue: 1,
      maxValue: 20,
      automationRate: "k-rate",
    }
  )

  protected _reduction = 0

  protected _release = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 0.25,
      automationRate: "k-rate",
    }
  )

  protected _threshold = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: -24,
      minValue: -100,
      maxValue: 0,
      automationRate: "k-rate",
    }
  )

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
