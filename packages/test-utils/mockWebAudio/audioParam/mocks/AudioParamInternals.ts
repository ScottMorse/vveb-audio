import { nanoid } from "nanoid"
import { MockInternals } from "../../../internal/util/vvebAudioMock"
import { BaseAudioContext, listenToCurrentTime } from "../../audioContext"
import { createAutomationTimeline } from "./automation"
import { AutomationTimeline } from "./automation"

export interface CreateMockAudioParamOptions {
  defaultValue?: number
  value?: number
  minValue?: number
  maxValue?: number
  automationRate?: AutomationRate
}

export class AudioParamInternals extends MockInternals<AudioParam> {
  automationRate: AutomationRate

  defaultValue: number

  id = nanoid()

  maxValue: number

  minValue: number

  value: number

  constructor(
    public context: BaseAudioContext,
    options?: CreateMockAudioParamOptions
  ) {
    super()
    this.defaultValue = options?.defaultValue ?? 0
    this.value = options?.value ?? this.defaultValue
    this.minValue = options?.minValue ?? 0
    this.maxValue = options?.maxValue ?? 1
    this.automationRate = options?.automationRate ?? "a-rate"

    this._automation = createAutomationTimeline("chromium", {
      context,
      initialValue: this.value,
      valueChangeCallback: (value) => this.setValue(value),
    })

    listenToCurrentTime(context, () => this._automation.handleTimeChange())
  }

  cancelAndHoldAtTime(cancelTime: number) {
    this._automation.schedule("cancel", { cancelTime, hold: true })
    return this.controller
  }

  cancelScheduledValues(cancelTime: number) {
    this._automation.schedule("cancel", { cancelTime, hold: false })
    return this.controller
  }

  exponentialRampToValueAtTime(value: number, endTime: number) {
    if (value > -1.4013e-45 && value < 1.4013e-45) {
      throw new RangeError(
        `Failed to execute 'exponentialRampToValueAtTime' on 'AudioParam': The float target value provided (${value}) should not be in the range (-1.40130e-45, 1.40130e-45).`
      )
    }
    this._automation.schedule("ramp", { kind: "exponential", endTime, value })
    return this.controller
  }

  linearRampToValueAtTime(value: number, endTime: number) {
    this._automation.schedule("ramp", { kind: "linear", endTime, value })
    return this.controller
  }

  setAutomationRate(automationRate: AutomationRate) {
    if (["a-rate", "k-rate"].includes(automationRate)) {
      this.automationRate = automationRate
    } else {
      throw new TypeError(
        `The provided value '${automationRate}' is not a valid enum value of type AutomationRate.`
      )
    }
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number) {
    this._automation.schedule("target", {
      target,
      startTime,
      timeConstant,
    })
    return this.controller
  }

  /** When delayed, value update is pushed to next call via setTimeout */
  setValue(value: number, delay?: boolean) {
    if (
      typeof value !== "number" ||
      isNaN(value) ||
      Math.abs(value) === Infinity
    ) {
      throw new TypeError(
        "Failed to set the value property on AudioParam: The provided float value is non-finite."
      )
    }

    if (delay) {
      setTimeout(() => {
        this.value = value
      })
    } else {
      this.value = value
    }
  }

  setValueAtTime(value: number, time: number) {
    this._automation.schedule("set", { value, time })
    return this.controller
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ) {
    this._automation.schedule("curve", {
      values,
      duration,
      startTime,
    })
    return this.controller
  }

  protected _automation: AutomationTimeline
}
