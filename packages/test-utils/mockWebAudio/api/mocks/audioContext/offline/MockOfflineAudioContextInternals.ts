import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { formatSampleRate } from "@@test-utils/mockWebAudio/util/deviceSettings"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import {
  convertSigned32Int,
  convertUnsigned32Int,
} from "@@test-utils/mockWebAudio/util/number"
import { MockBaseAudioContextInternals } from "../base/MockBaseAudioContextInternals"

export class MockOfflineAudioContextInternals
  extends MockBaseAudioContextInternals<OfflineAudioContext>
  implements
    Omit<OfflineAudioContext, keyof EventTarget | "listener" | "destination">
{
  /* eslint-disable lines-between-class-members */
  constructor(
    mock: OfflineAudioContext,
    mockEnvironment: MockEnvironment,
    options: OfflineAudioContextOptions
  )
  constructor(
    mock: OfflineAudioContext,
    mockEnvironment: MockEnvironment,
    numberOfChannels: number,
    length: number,
    sampleRate: number,
    argumentsLength?: number
  )
  constructor(
    mock: OfflineAudioContext,
    mockEnvironment: MockEnvironment,
    arg1: number | OfflineAudioContextOptions,
    length?: number,
    sampleRate?: number,
    argumentsLength?: number
  ) {
    super(mock, mockEnvironment)

    // mimics native behavior
    const sanitizeNumber = (value: any) =>
      typeof value === "number" && isFinite(value)
        ? convertSigned32Int(value)
        : 0

    if (argumentsLength === 1) {
      if (!arg1 || typeof arg1 !== "object") {
        throw new TypeError(
          "Failed to construct 'OfflineAudioContext': The provided value is not of type 'OfflineAudioContextOptions'."
        )
      }
    }

    if (argumentsLength === 2) {
      throw new TypeError(
        "Failed to construct 'OfflineAudioContext': Overload resolution failed."
      )
    }

    const _isOptionsArg = (arg: unknown): arg is OfflineAudioContextOptions =>
      argumentsLength === 1

    const isOptionsArg = _isOptionsArg(arg1)

    if (isOptionsArg) {
      for (const key of ["length", "numberOfChannels", "sampleRate"] as const) {
        if (arg1?.[key] === undefined) {
          throw new TypeError(
            `Failed to construct 'OfflineAudioContext': Failed to read the '${key}' property from 'OfflineAudioContextOptions': Required member is undefined.`
          )
        }
      }
    }

    const numberOfChannels = convertUnsigned32Int(
      sanitizeNumber(isOptionsArg ? arg1.numberOfChannels ?? 1 : arg1)
    )
    length = convertUnsigned32Int(
      sanitizeNumber(isOptionsArg ? arg1.length : length)
    )
    sampleRate = Number(isOptionsArg ? arg1.sampleRate : sampleRate)

    if (!isFinite(sampleRate)) {
      throw new TypeError(
        `Failed to construct 'OfflineAudioContext':${
          isOptionsArg
            ? " Failed to read the 'sampleRate' property from 'OfflineAudioContextOptions':"
            : ""
        } The provided float value is non-finite.`
      )
    }

    if ((length as number) < 1) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The number of frames provided (${length}) is less than the minimum bound (1).`,
        "NotSupportedError"
      )
    }

    const { audioBufferMaxChannelCount } = this.mockEnvironment.deviceSettings

    if (numberOfChannels < 1 || numberOfChannels > audioBufferMaxChannelCount) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The number of channels provided (${numberOfChannels}) is outside the range [1, ${audioBufferMaxChannelCount}].`,
        "NotSupportedError"
      )
    }

    const { minSampleRate, maxSampleRate } = this.mockEnvironment.deviceSettings

    if (sampleRate < minSampleRate || sampleRate > maxSampleRate) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The sampleRate provided (${formatSampleRate(
          sampleRate
        )}) is outside the range [${minSampleRate}, ${maxSampleRate}].`,
        "NotSupportedError"
      )
    }

    this._numberOfChannels = numberOfChannels
    this._length = length as number
    this._sampleRate = sampleRate
  }
  /* eslint-enable lines-between-class-members */

  get length() {
    return this._length
  }

  get oncomplete() {
    return this._oncomplete
  }

  set oncomplete(value) {
    this._oncomplete = sanitizeEventCallback(value)
  }

  async resume() {
    if (this.state === "running") return

    if (!this._hasStarted || this.state === "closed") {
      throw new DOMException(
        `Failed to execute 'resume' on 'OfflineAudioContext': cannot resume a context that has not started`
      )
    }

    this._resumeCallback?.()
  }

  get sampleRate() {
    return this._sampleRate
  }

  async startRendering() {
    if (this.state === "closed") {
      throw new DOMException(
        "Failed to execute 'startRendering' on 'OfflineAudioContext': cannot call startRendering on an OfflineAudioContext in a stopped state."
      )
    }

    if (this.state === "running") {
      throw new DOMException(
        "Failed to execute 'startRendering' on 'OfflineAudioContext': cannot startRendering when an OfflineAudioContext is running"
      )
    }

    this._hasStarted = true

    this._changeState("running")

    while (this.currentTime < this.length / this.sampleRate) {
      if (this._suspendTimes[this.currentTime]) {
        this._changeState("suspended")

        const { resolve, promise } = this._suspendTimes[this.currentTime]
        this._resumeCallback = resolve
        delete this._suspendTimes[this.currentTime]
        await promise

        this._changeState("running")

        // The context can be re-suspended at the current time while awaiting the previous promise
        if (this._suspendTimes[this.currentTime]) continue
      }
      this._currentTime++
      this._onCurrentTimeChanged()
    }

    this._changeState("closed")

    const renderedBuffer = new this.mockEnvironment.api.AudioBuffer({
      length: this._length,
      numberOfChannels: this._numberOfChannels,
      sampleRate: this._sampleRate,
    })

    const event = new this.mockEnvironment.api.OfflineAudioCompletionEvent(
      "complete",
      { renderedBuffer },
      ...([this.mock] as unknown as [])
    )

    this.oncomplete?.(event)
    this.mock.dispatchEvent(event)

    return renderedBuffer
  }

  async suspend(time: number) {
    if (!arguments.length) {
      throw new TypeError(
        "Failed to execute 'suspend' on 'OfflineAudioContext': 1 argument required, but only 0 present."
      )
    }

    time = Math.floor(Number(time)) // mimics native behavior

    if (this._suspendTimes[time]) {
      throw new DOMException(
        `Failed to execute 'suspend' on 'OfflineAudioContext': cannot schedule more than one suspend at frame ${
          time * this.sampleRate
        } (${time} seconds)`
      )
    }

    if (!isFinite(time)) {
      throw new TypeError(
        "Failed to execute 'suspend' on 'OfflineAudioContext': The provided double value is non-finite."
      )
    }

    if (this.state === "closed") {
      throw new DOMException(
        "Failed to execute 'suspend' on 'OfflineAudioContext': the rendering is already finished"
      )
    }

    if (time < 0) {
      throw new DOMException(
        `Failed to execute 'suspend' on 'OfflineAudioContext': negative suspend time (${time}) is not allowed`
      )
    }

    const seconds = this.length / this.sampleRate
    if (time >= seconds) {
      throw new DOMException(
        `Failed to execute 'suspend' on 'OfflineAudioContext': cannot schedule a suspend at ${time} seconds because it is greater than or equal to the total render duration of ${this.length} frames (${seconds} seconds)`
      )
    }

    if (time < this.currentTime) {
      throw new DOMException(
        `Failed to execute 'suspend' on 'OfflineAudioContext': suspend(${time}) failed to suspend at frame ${
          time * this.sampleRate
        } because it is earlier than the current frame of ${
          this.currentTime * this.sampleRate
        } (${this.currentTime} seconds)
      `
      )
    }

    const promise = new Promise<void>((resolve) => {
      this._suspendTimes[time] = {
        promise: null as unknown as Promise<void>,
        resolve,
      }
    })

    this._suspendTimes[time].promise = promise

    return promise
  }

  private _suspendTimes: {
    [time: number]: {
      promise: Promise<void>
      resolve: () => void
    }
  } = {}

  protected _numberOfChannels: number

  protected _length: number

  protected _sampleRate: number

  protected _oncomplete: ((e: OfflineAudioCompletionEvent) => any) | null = null

  protected _state: AudioContextState = "suspended"

  protected _hasStarted = false

  private _resumeCallback: (() => void) | null = null

  private _changeState(state: AudioContextState) {
    if (this._state !== state) {
      this._state = state
      this.onstatechange?.(new Event("statechange"))
    }
  }
}
