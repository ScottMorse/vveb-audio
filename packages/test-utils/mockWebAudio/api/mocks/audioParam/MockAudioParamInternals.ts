import { nanoid } from "nanoid"
import { MockEnvironment, MockInternals } from "../../mockFactory"
import { listenToCurrentTime } from "../audioContext/base/MockBaseAudioContext"
import { createAutomationTimeline, AutomationTimeline } from "./automation"

export interface CreateMockAudioParamOptions {
  defaultValue?: number
  value?: number
  minValue?: number
  maxValue?: number
  automationRate?: AutomationRate
  /** Name used in warning messages etc. */
  name?: string
}

export class MockAudioParamInternals
  extends MockInternals<AudioParam>
  implements AudioParam
{
  automationRate: AutomationRate

  defaultValue: number

  id = nanoid()

  maxValue: number

  minValue: number

  value: number

  constructor(
    mock: AudioParam,
    mockEnvironment: MockEnvironment,
    public context: BaseAudioContext,
    options?: CreateMockAudioParamOptions
  ) {
    super(mock, mockEnvironment)

    this.defaultValue = options?.defaultValue ?? 0
    this.value = options?.value ?? this.defaultValue
    this.minValue = options?.minValue ?? 0
    this.maxValue = options?.maxValue ?? 1
    this.automationRate = options?.automationRate ?? "a-rate"
    this._name = options?.name ?? "AudioParam"

    this._automation = createAutomationTimeline("chromium", {
      context,
      initialValue: this.value,
      valueChangeCallback: (value) => this.setValue(value),
    })

    listenToCurrentTime(context, () => this._automation.handleTimeChange())
  }

  cancelAndHoldAtTime(cancelTime: number) {
    this._automation.schedule("cancel", { cancelTime, hold: true })
    return this.mock
  }

  cancelScheduledValues(cancelTime: number) {
    this._automation.schedule("cancel", { cancelTime, hold: false })
    return this.mock
  }

  exponentialRampToValueAtTime(value: number, endTime: number) {
    if (value > -1.4013e-45 && value < 1.4013e-45) {
      throw new RangeError(
        `Failed to execute 'exponentialRampToValueAtTime' on 'AudioParam': The float target value provided (${value}) should not be in the range (-1.40130e-45, 1.40130e-45).`
      )
    }
    this._automation.schedule("ramp", {
      kind: "exponential",
      endTime,
      value: this._clampValue(value, "exponentialRampToValueAtTime value"),
    })
    return this.mock
  }

  linearRampToValueAtTime(value: number, endTime: number) {
    this._automation.schedule("ramp", {
      kind: "linear",
      endTime,
      value: this._clampValue(value, "linearRampToValueAtTime value"),
    })
    return this.mock
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
      target: this._clampValue(target, "setTargetAtTime value"),
      startTime,
      timeConstant,
    })
    return this.mock
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

    value = this._clampValue(value, "value")
    if (delay) {
      setTimeout(() => {
        this.value = value
      })
    } else {
      this.value = value
    }
  }

  setValueAtTime(value: number, time: number) {
    this._automation.schedule("set", {
      value: this._clampValue(value, "value"),
      time,
    })
    return this.mock
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ) {
    let warned = false
    this._automation.schedule("curve", {
      values: values.map((value) => {
        const clamped = this._clampValue(
          value,
          "setValueCurveAtTime value",
          !warned
        )
        warned = warned || clamped !== value
        return clamped
      }),
      duration,
      startTime,
    })
    return this.mock
  }

  protected _name: string

  protected _automation: AutomationTimeline

  protected _clampValue(value: number, method: string, warn = true) {
    const clamped = Math.max(this.minValue, Math.min(this.maxValue, value))
    if (warn && value !== clamped) {
      console.warn(
        new Error(
          `${this._name}.${method} ${value} outside nominal range [${this.minValue}, ${this.maxValue}]; value will be clamped.`
        )
      )
    }
    return clamped
  }
}
