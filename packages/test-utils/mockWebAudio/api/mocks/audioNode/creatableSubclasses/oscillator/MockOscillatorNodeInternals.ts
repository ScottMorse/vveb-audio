import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockOscillatorNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements OscillatorNode
{
  constructor(context: BaseAudioContext, _options?: OscillatorOptions) {
    super(context)
  }

  get channelCount() {
    return this._channelCount
  }

  get detune() {
    return this._detune
  }

  get frequency() {
    return this._frequency
  }

  get numberOfInputs() {
    return 0
  }

  setPeriodicWave(_periodicWave: PeriodicWave): void {}

  get type() {
    return this._type
  }

  protected _detune = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 0,
      minValue: -153600,
      maxValue: 153600,
    }
  )

  protected _frequency = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 440,
      minValue: -22050,
      maxValue: 22050,
    }
  )

  protected _type: OscillatorType = "sine"

  protected _channelCount = 2
}
