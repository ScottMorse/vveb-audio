import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockDynamicsCompressorNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<DynamicsCompressorNode>
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
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 0.003000000026077032,
      automationRate: "k-rate",
      name: "DynamicsCompressor.attack",
    }
  )

  protected _knee = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 30,
      maxValue: 40,
      automationRate: "k-rate",
      name: "DynamicsCompressor.knee",
    }
  )

  protected _ratio = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 12,
      minValue: 1,
      maxValue: 20,
      automationRate: "k-rate",
      name: "DynamicsCompressor.ratio",
    }
  )

  protected _reduction = 0

  protected _release = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 0.25,
      automationRate: "k-rate",
      name: "DynamicsCompressor.release",
    }
  )

  protected _threshold = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
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
