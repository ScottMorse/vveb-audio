import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockBiquadFilterNodeInternals
  extends MockAudioNodeInternals
  implements BiquadFilterNode
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
    getEngineContext(this),
    this.context,
    {
      minValue: -153600,
      maxValue: 153600,
    }
  )

  protected _frequency = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 350,
      minValue: 0,
      maxValue: 22050,
    }
  )

  protected _gain = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 1541.273681640625,
    }
  )

  protected _Q = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _type: BiquadFilterType = "lowpass"

  protected _channelCount = 2
}
