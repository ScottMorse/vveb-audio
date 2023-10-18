import {
  MockEnvironment,
  MockInternals,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { isInstanceType } from "@@test-utils/mockWebAudio/util/instanceType"
import { createStreamId } from "@@test-utils/mockWebAudio/util/mediaStream"

export class MockMediaStreamInternals
  extends MockInternals<MediaStream>
  implements Omit<MediaStream, keyof EventTarget>
{
  readonly eventTarget = new EventTarget()

  constructor(
    mock: MediaStream,
    mockEnvironment: MockEnvironment,
    streamOrTracks?: MediaStream | MediaStreamTrack[]
  ) {
    super(mock, mockEnvironment)

    if (Array.isArray(streamOrTracks)) {
      for (const track of streamOrTracks) {
        if (!isInstanceType(track, "MediaStreamTrack", mockEnvironment.api)) {
          throw new TypeError(
            "Failed to construct 'MediaStream': Failed to convert value to 'MediaStreamTrack'."
          )
        }
      }
    } else if (
      streamOrTracks !== undefined &&
      !isInstanceType(streamOrTracks, "MediaStream", mockEnvironment.api)
    ) {
      throw new TypeError(
        "Failed to construct 'MediaStream': Overload resolution failed."
      )
    }

    if (isInstanceType(streamOrTracks, "MediaStream", mockEnvironment.api)) {
      this._tracks = [...streamOrTracks.getTracks()]
    } else if (Array.isArray(streamOrTracks)) {
      this._tracks = [...streamOrTracks]

      /**
       * @todo review: is this always the case?
       * Seen in Chrome when constructing MediaStream from AudioContext stream destination node's stream tracks
       */
      this._active = true
    }
  }

  get active() {
    return this._active
  }

  addTrack(track: MediaStreamTrack): void {
    this._tracks.push(track)
    this.eventTarget.dispatchEvent(new Event("addtrack"))
  }

  clone(): MediaStream {
    const clonedStream = new this.mockEnvironment.api.MediaStream(this.mock)
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
