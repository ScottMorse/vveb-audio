import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { createStreamId } from "@@test-utils/mockWebAudio/util/mediaStream"

export class MockMediaStreamInternals
  extends MockInternals<MediaStream>
  implements MediaStream
{
  readonly eventTarget = new EventTarget()

  constructor(streamOrTracks?: MediaStream | MediaStreamTrack[]) {
    super()

    if (Array.isArray(streamOrTracks)) {
      for (const track of streamOrTracks) {
        if (!(track instanceof MediaStreamTrack)) {
          throw new TypeError(
            "Failed to construct 'MediaStream': Failed to convert value to 'MediaStreamTrack'."
          )
        }
      }
    } else if (
      streamOrTracks !== undefined &&
      !(streamOrTracks instanceof MediaStream)
    ) {
      throw new TypeError(
        "Failed to construct 'MediaStream': Overload resolution failed."
      )
    }

    if (streamOrTracks instanceof MediaStream) {
      this._tracks = [...streamOrTracks.getTracks()]
    } else if (Array.isArray(streamOrTracks)) {
      this._tracks = [...streamOrTracks]
    }
  }

  get active() {
    return this._active
  }

  addEventListener<K extends keyof MediaStreamEventMap>(
    type: K,
    listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void

  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    this.eventTarget.addEventListener(
      type as any,
      listener as any,
      options as any
    )
  }

  addTrack(track: MediaStreamTrack): void {
    this._tracks.push(track)
    this.eventTarget.dispatchEvent(new Event("addtrack"))
  }

  clone(): MediaStream {
    const clonedStream = new (getEngineContext(this).mockApi.MediaStream)(this)
    this._tracks.forEach((track) => clonedStream.addTrack(track.clone() as any))
    return clonedStream as any
  }

  dispatchEvent(event: Event) {
    return this.eventTarget.dispatchEvent(event)
  }

  getAudioTracks(): MediaStreamTrack[] {
    return this._tracks.filter((track) => track.kind === "audio")
  }

  getTrackById(id: string): MediaStreamTrack | null {
    return this._tracks.find((track) => track.id === id) || null
  }

  getTracks(): MediaStreamTrack[] {
    return [...this._tracks]
  }

  getVideoTracks(): MediaStreamTrack[] {
    return this._tracks.filter((track) => track.kind === "video")
  }

  get id() {
    return this._id
  }

  get onactive() {
    return this._onactive
  }

  set onactive(callback) {
    this._onactive = sanitizeEventCallback(callback)
  }

  get onaddtrack() {
    return this._onaddtrack
  }

  set onaddtrack(callback) {
    this._onaddtrack = sanitizeEventCallback(callback)
  }

  get oninactive() {
    return this._oninactive
  }

  set oninactive(callback) {
    this._oninactive = sanitizeEventCallback(callback)
  }

  get onremovetrack() {
    return this._onremovetrack
  }

  set onremovetrack(callback) {
    this._onremovetrack = sanitizeEventCallback(callback)
  }

  removeEventListener<K extends keyof MediaStreamEventMap>(
    type: K,
    listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ): void

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined
  ): void

  removeEventListener(
    type: unknown,
    listener: unknown,
    options?: unknown
  ): void {
    this.eventTarget.removeEventListener(
      type as any,
      listener as any,
      options as any
    )
  }

  removeTrack(track: MediaStreamTrack): void {
    const trackIndex = this._tracks.indexOf(track)
    if (trackIndex > -1) {
      this._tracks.splice(trackIndex, 1)
      this.eventTarget.dispatchEvent(new Event("removetrack"))
    }
  }

  protected _active = false

  protected _id = createStreamId()

  protected _onactive: ((this: any, ev: Event) => any) | null = null

  protected _onaddtrack: ((this: any, ev: Event) => any) | null = null

  protected _oninactive: ((this: any, ev: Event) => any) | null = null

  protected _onremovetrack: ((this: any, ev: Event) => any) | null = null

  protected _tracks: MediaStreamTrack[] = []
}
