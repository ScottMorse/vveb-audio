import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { createStreamId } from "@@test-utils/mockWebAudio/util/mediaStream"
import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("1234567890abcdef", 16)

export interface MediaStreamTrackOptions {
  /** Default is 'audio' */
  kind?: "audio" | "video"
  /** Default is "Default" */
  label?: string
  /** Default is "" */
  contentHint?: "music" | "speech" | "motion" | "detail" | "text" | ""
  /** Default is false */
  muted?: boolean
  /** Default is "live" */
  readyState?: MediaStreamTrackState
  constraints?: MediaTrackConstraints
}

export class MockMediaStreamTrackInternals
  extends MockInternals<MediaStreamTrack>
  implements Omit<MediaStreamTrack, "clone">
{
  readonly eventTarget = new EventTarget()

  constructor(options?: MediaStreamTrackOptions) {
    super()

    this._kind = options?.kind ?? "audio"
    this._label = options?.label ?? "Default"
    this._contentHint = options?.contentHint ?? ""
    this._muted = options?.muted ?? false
    this._readyState = options?.readyState ?? "live"
    this.applyConstraints(options?.constraints)

    if (this.readyState === "ended") {
      this._stopped = true
    }
  }

  addEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void

  addEventListener(
    type: unknown,
    listener: unknown,
    options?: AddEventListenerOptions
  ) {
    return this.eventTarget.addEventListener(
      type as any,
      listener as any,
      options
    )
  }

  async applyConstraints(constraints?: MediaTrackConstraints) {
    if (!["undefined", "object", "function"].includes(typeof constraints)) {
      throw new TypeError(
        "'Failed to execute 'applyConstraints' on 'MediaStreamTrack': The provided value is not of type 'MediaTrackConstraints'."
      )
    }
    this._constraints.latency
    this._constraints =
      typeof constraints === "function" ? {} : constraints ?? {}
  }

  get contentHint() {
    return this._contentHint
  }

  dispatchEvent(event: Event): boolean

  dispatchEvent(event: Event): boolean

  dispatchEvent(event: unknown): boolean {
    return this.eventTarget.dispatchEvent(event as any)
  }

  get enabled() {
    return this._enabled
  }

  set enabled(enabled) {
    this._enabled = !!enabled
  }

  getCapabilities(): MediaTrackCapabilities {
    return {
      ...getEngineContext(this).deviceSettings.mediaTrackCapabilities,
      deviceId: this._deviceId,
    }
  }

  getConstraints(): MediaTrackConstraints {
    return {
      ...this._constraints,
    }
  }

  getSettings(): MediaTrackSettings {
    return {
      ...getEngineContext(this).deviceSettings.mediaTrackSettings,
      deviceId: this._deviceId,
    }
  }

  get id() {
    return this._id
  }

  get kind() {
    return this._kind
  }

  get label() {
    return this._label
  }

  get muted() {
    return this._muted
  }

  get onended() {
    return this._onended
  }

  set onended(callback) {
    this._onended = sanitizeEventCallback(callback)
  }

  get onmute() {
    return this._onmute
  }

  set onmute(callback) {
    this._onmute = sanitizeEventCallback(callback)
  }

  get onunmute() {
    return this._onunmute
  }

  set onunmute(callback) {
    this._onunmute = sanitizeEventCallback(callback)
  }

  get readyState() {
    return this._readyState
  }

  removeEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return this.eventTarget.removeEventListener(type, listener, options)
  }

  stop() {
    this._readyState = "ended"
    this._stopped = true
    this.eventTarget.dispatchEvent(new Event("ended"))
  }

  protected _enabled = true

  protected _id = createStreamId()

  protected _deviceId = nanoid(16)

  protected _kind: MediaStreamTrack["kind"]

  protected _readyState: MediaStreamTrackState

  protected _label: string

  protected _muted = false

  protected _contentHint: string

  protected _stopped = false

  protected _constraints: MediaTrackConstraints = {}

  protected _onended: ((this: MediaStreamTrack, ev: Event) => any) | null = null

  protected _onmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null

  protected _onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null =
    null
}
