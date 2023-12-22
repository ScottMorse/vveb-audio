import { delay } from "@@core/internal/testing/delay"
import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { formatSampleRate } from "@@test-utils/mockWebAudio/util/deviceSettings"
import { MockBaseAudioContextInternals } from "../base/MockBaseAudioContextInternals"

const throwStateDomException = (method: "resume" | "suspend" | "close") => {
  throw new DOMException(`Cannot ${method} a closed AudioContext.`)
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
  extends MockBaseAudioContextInternals<AudioContext>
  implements Omit<AudioContext, keyof EventTarget | "destination" | "listener">
{
  constructor(
    mock: AudioContext,
    mockEnvironment: MockEnvironment,
    options?: AudioContextOptions
  ) {
    super(mock, mockEnvironment)

    this._sampleRate = Number(
      options?.sampleRate === undefined ? 44_100 : options?.sampleRate
    )

    this.validateSampleRate(this._sampleRate)
    if (options?.latencyHint !== undefined)
      validateLatencyHint(options?.latencyHint)

    this._keepLiveTime()

    this._state =
      "running" /** @todo configure whether context can start? Or mimic browser behavior? */
    fireStateChangeEvent(this.mock) // this should only happen if the context's initial state is running
  }

  get baseLatency() {
    return this.mockEnvironment.deviceSettings.audioContextBaseLatency
  }

  async close() {
    if (this._state === "closed") throwStateDomException("close")

    this._state = "closed"
    this._stopKeepingLiveTime()
    fireStateChangeEvent(this.mock)
  }

  createMediaElementSource(
    mediaElement: HTMLMediaElement
  ): MediaElementAudioSourceNode {
    /**
     * @todo When a mock uses the mock API to create instances in the internals,
     * perhaps care should be taken as to whether the user disabled
     * the mock from being used globally. Perhaps if the mock API is currently
     * set to globalThis and certain classes were excluded, attempt to
     * resolve either the globalThis class or the mock class for excluded
     * classes, warning and falling back to the mock class if the globalThis
     * class does not exist. (also @todo, use configurable logger for library logs like this)
     */
    return new this.mockEnvironment.api.MediaElementAudioSourceNode(this.mock, {
      mediaElement,
    })
  }

  createMediaStreamDestination(): MediaStreamAudioDestinationNode {
    return new this.mockEnvironment.api.MediaStreamAudioDestinationNode(
      this.mock
    )
  }

  createMediaStreamSource(
    mediaStream: MediaStream
  ): MediaStreamAudioSourceNode {
    return new this.mockEnvironment.api.MediaStreamAudioSourceNode(this.mock, {
      mediaStream,
    })
  }

  getOutputTimestamp(): AudioTimestamp {
    return {
      contextTime: this.currentTime,
      performanceTime: this._currentPerformanceTime,
    }
  }

  get outputLatency() {
    return this.mockEnvironment.deviceSettings.audioContextOutputLatency
  }

  async resume() {
    await delay(0)
    if (this._state === "closed") throwStateDomException("resume")
    if (this._state === "running") return

    this._state = "running"
    this._keepLiveTime()
    fireStateChangeEvent(this.mock)
  }

  async suspend() {
    if (this._state === "closed") throwStateDomException("suspend")
    if (this._state === "suspended") return

    this._state = "suspended"
    this._stopKeepingLiveTime()
    fireStateChangeEvent(this.mock)
  }

  protected validateSampleRate(sampleRate: number) {
    if (isNaN(sampleRate) || !isFinite(sampleRate)) {
      throw new TypeError(
        `Failed to construct 'AudioContext': Failed to read the 'sampleRate' property from 'AudioContextOptions': The provided float value is non-finite.`
      )
    }

    const { minSampleRate, maxSampleRate } = this.mockEnvironment.deviceSettings

    if (sampleRate < minSampleRate || sampleRate > maxSampleRate) {
      throw new DOMException(
        `Failed to construct 'AudioContext': The hardware sample rate provided (${formatSampleRate(
          sampleRate
        )}) is outside the range [${minSampleRate}, ${maxSampleRate}].`,
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
    this._keepTimeInterval = setInterval(callback, 10)
  }

  protected _stopKeepingLiveTime() {
    if (this._keepTimeInterval !== null) {
      clearInterval(this._keepTimeInterval)
    }
  }
}
