/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

export class AudioParam {
  automationRate: AutomationRate = "a-rate" /** @todo review default */
  defaultValue = 0 /** @todo review default */
  maxValue = 0 /** @todo review default */
  minValue = 0 /** @todo review default */
  value = 0 /** @todo review default */

  setValueAtTime(value: number, startTime: number): AudioParam {
    return this
  }

  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    return this
  }

  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    return this
  }

  setTargetAtTime(
    target: number,
    startTime: number,
    timeConstant: number
  ): AudioParam {
    return this
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ): AudioParam {
    return this
  }

  cancelScheduledValues(startTime: number): AudioParam {
    return this
  }

  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    return this
  }
}
