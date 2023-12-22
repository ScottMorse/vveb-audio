import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockBiquadFilterNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<BiquadFilterNode>
{
  get channelCount() {
    return this._channelCount
  }

  get detune() {
    return this._detune
  }

  get frequency() {
    return this._frequency
  }

  get gain() {
    return this._gain
  }

  getFrequencyResponse(
    _frequencyHz: Float32Array,
    _magResponse: Float32Array,
    _phaseResponse: Float32Array
  ): void {}

  get Q() {
    return this._Q
  }

  get type() {
    return this._type
  }

  protected _detune = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      minValue: -153600,
      maxValue: 153600,
      name: "BiquadFilterNode.detune",
    }
  )

  protected _frequency = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 350,
      minValue: 0,
      maxValue: 22050,
      name: "BiquadFilterNode.frequency",
    }
  )

  protected _gain = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 1541.273681640625,
      name: "BiquadFilterNode.gain",
    }
  )

  protected _Q = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "BiquadFilterNode.Q",
    }
  )

  protected _type: BiquadFilterType = "lowpass"

  protected _channelCount = 2
}
