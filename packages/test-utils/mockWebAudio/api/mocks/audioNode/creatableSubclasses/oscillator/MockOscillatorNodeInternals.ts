import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockOscillatorNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements OmitEventTarget<OscillatorNode>
{
  constructor(
    mock: OscillatorNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext,
    _options?: OscillatorOptions
  ) {
    super(mock, mockEnvironment, context)
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
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 0,
      minValue: -153600,
      maxValue: 153600,
      name: "Oscillator.detune",
    }
  )

  protected _frequency = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 440,
      minValue: -22050,
      maxValue: 22050,
      name: "Oscillator.frequency",
    }
  )

  protected _type: OscillatorType = "sine"

  protected _channelCount = 2
}
