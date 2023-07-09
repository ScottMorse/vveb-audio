import { EngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { BaseMock, getInternals, MockConstructorName } from "../../baseMock"
import {
  AudioParamInternals,
  CreateMockAudioParamOptions,
} from "./AudioParamInternals"

const ALLOW_CONSTRUCTOR = Symbol()

@MockConstructorName("AudioParam")
export class MockAudioParam
  extends BaseMock<AudioParamInternals>
  implements AudioParam
{
  constructor(
    context: BaseAudioContext,
    _allow?: typeof ALLOW_CONSTRUCTOR,
    options?: CreateMockAudioParamOptions
  ) {
    if (_allow !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
    super(new AudioParamInternals(context, options))
  }

  get automationRate() {
    return getInternals(this).automationRate
  }

  set automationRate(automationRate: AutomationRate) {
    getInternals(this).setAutomationRate(automationRate)
  }

  cancelAndHoldAtTime(cancelTime: number) {
    return getInternals(this).cancelAndHoldAtTime(cancelTime)
  }

  cancelScheduledValues(startTime: number) {
    return getInternals(this).cancelScheduledValues(startTime)
  }

  get defaultValue() {
    return getInternals(this).defaultValue
  }

  exponentialRampToValueAtTime(value: number, endTime: number) {
    return getInternals(this).exponentialRampToValueAtTime(value, endTime)
  }

  linearRampToValueAtTime(value: number, endTime: number) {
    return getInternals(this).linearRampToValueAtTime(value, endTime)
  }

  get maxValue() {
    return getInternals(this).maxValue
  }

  get minValue() {
    return getInternals(this).minValue
  }

  setTargetAtTime(target: number, startTime: number, _timeConstant: number) {
    return getInternals(this).setTargetAtTime(target, startTime, _timeConstant)
  }

  setValueAtTime(value: number, startTime: number) {
    return getInternals(this).setValueAtTime(value, startTime)
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ) {
    return getInternals(this).setValueCurveAtTime(values, startTime, duration)
  }

  get value() {
    return getInternals(this).value
  }

  set value(value: number) {
    getInternals(this).setValue(value, true)
  }
}

export const createMockAudioParam = (
  engineContext: EngineContext,
  context: BaseAudioContext,
  options?: CreateMockAudioParamOptions
) =>
  new (engineContext.mockApi.AudioParam)(
    context,
    ALLOW_CONSTRUCTOR,
    options
  )
