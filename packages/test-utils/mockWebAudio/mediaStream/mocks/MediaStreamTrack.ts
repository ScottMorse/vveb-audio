import { customAlphabet } from "nanoid"
import { getGlobalDeviceSetting } from "../../../internal/util/deviceSettings"
import { sanitizeEventCallback } from "../../../internal/util/events"
import { createStreamId } from "../../../internal/util/mediaStream"
import { NativeMediaStreamTrack } from "../../../internal/util/nativeTypes"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

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

export class MediaStreamTrack
  extends EventTarget
  implements NativeMediaStreamTrack
{
  constructor(
    options?: MediaStreamTrackOptions,
    __allowConstructor?: typeof ALLOW_CONSTRUCTOR
  ) {
    if (__allowConstructor !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
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

  clone() {
    return new MediaStreamTrack(
      {
        kind: this._kind as MediaStreamTrackOptions["kind"],
        label: this._label,
        contentHint: this
          ._contentHint as MediaStreamTrackOptions["contentHint"],
        muted: this._muted,
        readyState: this._readyState,
        constraints: this._constraints,
      },
      ALLOW_CONSTRUCTOR
    ) as unknown as NativeMediaStreamTrack
  }

  get contentHint() {
    return this._contentHint
  }

  get enabled() {
    return this._enabled
  }

  set enabled(enabled) {
    this._enabled = !!enabled
  }

  getCapabilities(): MediaTrackCapabilities {
    return {
      ...getGlobalDeviceSetting("mediaTrackCapabilities"),
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
      ...getGlobalDeviceSetting("mediaTrackSettings"),
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

  stop() {
    this._readyState = "ended"
    this._stopped = true
    this.dispatchEvent(new Event("ended"))
  }

  protected _enabled = true

  protected _id = createStreamId()

  protected _deviceId = nanoid(16)

  protected _kind: string

  protected _readyState: MediaStreamTrackState

  protected _label: string

  protected _muted = false

  protected _contentHint: string

  protected _stopped = false

  protected _constraints: MediaTrackConstraints = {}

  protected _onended:
    | ((this: NativeMediaStreamTrack, ev: Event) => any)
    | null = null

  protected _onmute: ((this: NativeMediaStreamTrack, ev: Event) => any) | null =
    null

  protected _onunmute:
    | ((this: NativeMediaStreamTrack, ev: Event) => any)
    | null = null
}

export const createMockMediaStreamTrack = (options?: MediaStreamTrackOptions) =>
  new MediaStreamTrack(options, ALLOW_CONSTRUCTOR)
