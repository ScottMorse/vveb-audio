import { ConstructorNameToString } from "../../../internal/util/decorators"
import { sanitizeEventCallback } from "../../../internal/util/events"
import { createStreamId } from "../../../internal/util/mediaStream"
import { NativeMediaStream } from "../../../internal/util/nativeTypes"
import { MediaStreamTrack } from "./MediaStreamTrack"

@ConstructorNameToString
export class MediaStream extends EventTarget implements NativeMediaStream {
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

  addTrack(track: MediaStreamTrack): void {
    this._tracks.push(track)
    this.dispatchEvent(new Event("addtrack"))
  }

  clone(): NativeMediaStream {
    const clonedStream = new MediaStream()
    this._tracks.forEach((track) => clonedStream.addTrack(track.clone() as any))
    return clonedStream as any
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

  removeTrack(track: MediaStreamTrack): void {
    const trackIndex = this._tracks.indexOf(track)
    if (trackIndex > -1) {
      this._tracks.splice(trackIndex, 1)
      this.dispatchEvent(new Event("removetrack"))
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
