import { delay } from "@@core/internal/testing/delay"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockBaseAudioContextInternals } from "../base/MockBaseAudioContextInternals"

const throwStateDomException = (method: "resume" | "suspend" | "close") => {
  throw new DOMException(
    `Failed to execute '${method}' on 'AudioContext': Cannot ${method} a closed AudioContext.`
  )
}

const validateLatencyHint = (latencyHint: number | string) => {
  if (typeof latencyHint !== "number") {
    if (!["interactive", "playback", "balanced"].includes(latencyHint)) {
      throw new TypeError(
        `Failed to construct 'AudioContext': Failed to read the 'latencyHint' property from 'AudioContextOptions': The provided value '${latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`
      )
    }
  } else if (!isFinite(Number(latencyHint))) {
    throw new TypeError(
      `Failed to construct 'AudioContext': Failed to read the 'latencyHint' property from 'AudioContextOptions': The provided double value is non-finite.`
    )
  }
}

const fireStateChangeEvent = (context: BaseAudioContext) => {
  // setTimeout used to mimic call stack timing of native context
  setTimeout(() => context.onstatechange?.(new Event("statechange")))
}

export class MockAudioContextInternals
  extends MockBaseAudioContextInternals
  implements AudioContext
{
  constructor(options?: AudioContextOptions) {
    super()
    this._sampleRate = Number(
      options?.sampleRate === undefined ? 44_100 : options?.sampleRate
    )

    this.validateSampleRate(this._sampleRate)
    if (options?.latencyHint !== undefined)
      validateLatencyHint(options?.latencyHint)

    if (this.constructor.name !== "OfflineAudioContext") {
      this._keepLiveTime()
    }

    this._state =
      "running" /** @todo configure whether context can start? Or mimic browser behavior? */
    fireStateChangeEvent(this) // this should only happen if the context's initial state is running
  }

  get baseLatency() {
    return 0.01
  }

  async close() {
    if (this._state === "closed") throwStateDomException("close")

    this._state = "closed"
    this._stopKeepingLiveTime()
    fireStateChangeEvent(this)
  }

  createMediaElementSource(
    mediaElement: HTMLMediaElement
  ): MediaElementAudioSourceNode {
    return new (getEngineContext(this).mockApi.MediaElementAudioSourceNode)(
      this,
      {
        mediaElement,
      }
    )
  }

  createMediaStreamDestination(): MediaStreamAudioDestinationNode {
    return new (getEngineContext(this).mockApi.MediaStreamAudioDestinationNode)(
      this
    )
  }

  createMediaStreamSource(
    mediaStream: MediaStream
  ): MediaStreamAudioSourceNode {
    return new (getEngineContext(this).mockApi.MediaStreamAudioSourceNode)(
      this,
      {
        mediaStream,
      }
    )
  }

  getOutputTimestamp(): AudioTimestamp {
    return {
      contextTime: this.currentTime,
      performanceTime: this._currentPerformanceTime,
    }
  }

  get outputLatency() {
    return 0.05
  }

  async resume() {
    await delay(0)
    if (this._state === "closed") throwStateDomException("resume")
    if (this._state === "running") return

    this._state = "running"
    this._keepLiveTime()
    fireStateChangeEvent(this)
  }

  async suspend() {
    if (this._state === "closed") throwStateDomException("suspend")
    if (this._state === "suspended") return

    this._state = "suspended"
    this._stopKeepingLiveTime()
    fireStateChangeEvent(this)
  }

  protected validateSampleRate(sampleRate: number) {
    if (isNaN(sampleRate) || !isFinite(sampleRate)) {
      throw new TypeError(
        `Failed to construct 'AudioContext': Failed to read the 'sampleRate' property from 'AudioContextOptions': The provided float value is non-finite.`
      )
    }

    const { minSampleRate, maxSampleRate } =
      getEngineContext(this).deviceSettings

    if (sampleRate < minSampleRate || sampleRate > maxSampleRate) {
      throw new DOMException(
        `Failed to construct 'AudioContext': The hardware sample rate provided (${sampleRate}) is outside the range [${minSampleRate}, ${maxSampleRate}].`,
        "NotSupportedError"
      )
    }
  }

  private _keepTimeInterval: NodeJS.Timeout | null = null

  protected _keepLiveTime() {
    this._stopKeepingLiveTime()
    const callback = () => {
      this._currentTime += 0.01
      this._currentPerformanceTime = performance.now()
      this._onCurrentTimeChanged()
    }
    this._keepTimeInterval = setInterval(callback, 0)
  }

  protected _stopKeepingLiveTime() {
    if (this._keepTimeInterval !== null) {
      clearInterval(this._keepTimeInterval)
    }
  }
}
