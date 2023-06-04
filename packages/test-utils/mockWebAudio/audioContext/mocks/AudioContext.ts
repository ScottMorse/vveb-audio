import { delay } from "@@core/internal/testing/delay"
import { ConstructorNameToString } from "../../../internal/util/decorators"
import { getGlobalDeviceSetting } from "../../../internal/util/deviceSettings"
import { NativeAudioContext } from "../../../internal/util/nativeTypes"
import { MOCK_AUDIO_NODE_SUBCLASSES } from "../../audioNode"
import { BaseAudioContext } from "./BaseAudioContext"

const throwStateDomException = (method: "resume" | "suspend" | "close") => {
  throw new DOMException(
    `Failed to execute '${method}' on 'AudioContext': Cannot ${method} a closed AudioContext.`
  )
}

const validateSampleRate = (sampleRate: number) => {
  if (isNaN(sampleRate) || !isFinite(sampleRate)) {
    throw new TypeError(
      `Failed to construct 'AudioContext': Failed to read the 'sampleRate' property from 'AudioContextOptions': The provided float value is non-finite.`
    )
  }
  if (
    sampleRate < getGlobalDeviceSetting("minSampleRate") ||
    sampleRate > getGlobalDeviceSetting("maxSampleRate")
  ) {
    throw new DOMException(
      `Failed to construct 'AudioContext': The hardware sample rate provided (${sampleRate}) is outside the range [${getGlobalDeviceSetting(
        "minSampleRate"
      )}, ${getGlobalDeviceSetting("maxSampleRate")}].`,
      "NotSupportedError"
    )
  }
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

const fireStateChangeEvent = (context: AudioContext) => {
  // setTimeout used to mimic call stack timing of native context
  setTimeout(() =>
    (context as unknown as NativeAudioContext).onstatechange?.(
      new Event("statechange")
    )
  )
}

@ConstructorNameToString
export class AudioContext
  extends BaseAudioContext
  implements NativeAudioContext
{
  constructor(options?: AudioContextOptions) {
    super()
    this._sampleRate = Number(
      options?.sampleRate === undefined ? 44_100 : options?.sampleRate
    )

    validateSampleRate(this._sampleRate)
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

  createMediaElementSource(mediaElement: HTMLMediaElement) {
    return new MOCK_AUDIO_NODE_SUBCLASSES.mediaElementAudioSource.cls(this, {
      mediaElement,
    }) as unknown as MediaElementAudioSourceNode
  }

  createMediaStreamDestination() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.mediaStreamAudioDestination.cls(
      this
    ) as unknown as MediaStreamAudioDestinationNode
  }

  createMediaStreamSource(mediaStream: MediaStream) {
    return new MOCK_AUDIO_NODE_SUBCLASSES.mediaStreamAudioSource.cls(this, {
      mediaStream,
    }) as unknown as MediaStreamAudioSourceNode
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
