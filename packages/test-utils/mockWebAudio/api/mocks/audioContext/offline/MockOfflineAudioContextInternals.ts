import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { flipInt } from "@@test-utils/mockWebAudio/util/number"
import { MockBaseAudioContextInternals } from "../base/MockBaseAudioContextInternals"

export class MockOfflineAudioContextInternals
  extends MockBaseAudioContextInternals<OfflineAudioContext>
  implements OfflineAudioContext
{
  /* eslint-disable lines-between-class-members */
  constructor(options: OfflineAudioContextOptions)
  constructor(numberOfChannels: number, length: number, sampleRate: number)
  constructor(
    arg1: number | OfflineAudioContextOptions,
    length?: number,
    sampleRate?: number
  ) {
    super()

    // mimics native behavior
    const sanitizeNumber = (value: any) =>
      typeof value === "number" && isFinite(value) ? flipInt(value) : 0

    const isOptionsArg = typeof arg1 === "object"

    const numberOfChannels = sanitizeNumber(
      isOptionsArg ? arg1.numberOfChannels ?? 1 : arg1
    )
    length = sanitizeNumber(isOptionsArg ? arg1.length : length)
    sampleRate = Number(isOptionsArg ? arg1.sampleRate : sampleRate)

    if (!isFinite(sampleRate)) {
      throw new TypeError(
        `Failed to construct 'OfflineAudioContext': The provided float value is non-finite.`
      )
    }

    if ((length as number) < 1) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The number of frames provided (${length}) is less than the minimum bound (1).`,
        "NotSupportedError"
      )
    }

    const { maxChannels } = getEngineContext(this).deviceSettings

    if (numberOfChannels < 1 || numberOfChannels > maxChannels) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The number of channels provided (${numberOfChannels}) is outside the range [1, ${maxChannels}].`,
        "NotSupportedError"
      )
    }

    const { minSampleRate, maxSampleRate } =
      getEngineContext(this).deviceSettings

    if (sampleRate < minSampleRate || sampleRate > maxSampleRate) {
      throw new DOMException(
        `Failed to construct 'OfflineAudioContext': The sampleRate provided (${sampleRate}) is outside the range [${minSampleRate}, ${maxSampleRate}].`,
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

    const renderedBuffer = new (getEngineContext(this).mockApi.AudioBuffer)({
      length: this._length,
      numberOfChannels: this._numberOfChannels,
      sampleRate: this._sampleRate,
    })

    const event = new (getEngineContext(
      this
    ).mockApi.OfflineAudioCompletionEvent)(
      "complete",
      { renderedBuffer },
      this.mock
    )

    this.oncomplete?.(event)
    this.dispatchEvent(event)

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
