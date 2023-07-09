import { BaseMock, getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockMediaStreamInternals } from "./MockMediaStreamInternals"

export class MockMediaStream
  extends BaseMock<MockMediaStreamInternals>
  implements MediaStream
{
  constructor(streamOrTracks?: MediaStream | MediaStreamTrack[]) {
    super(new MockMediaStreamInternals(streamOrTracks))
  }

  get active() {
    return getInternals(this).active
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
    getInternals(this).addEventListener(
      type as any,
      listener as any,
      options as any
    )
  }

  addTrack(track: MediaStreamTrack) {
    getInternals(this).addTrack(track)
  }

  clone() {
    return getInternals(this).clone()
  }

  dispatchEvent(event: Event): boolean {
    return getInternals(this).dispatchEvent(event)
  }

  getAudioTracks(): MediaStreamTrack[] {
    return getInternals(this).getAudioTracks()
  }

  getTrackById(trackId: string) {
    return getInternals(this).getTrackById(trackId)
  }

  getTracks() {
    return getInternals(this).getTracks()
  }

  getVideoTracks() {
    return getInternals(this).getVideoTracks()
  }

  get id() {
    return getInternals(this).id
  }

  get onactive() {
    return getInternals(this).onactive
  }

  set onactive(value) {
    getInternals(this).onactive = value
  }

  get onaddtrack() {
    return getInternals(this).onaddtrack
  }

  set onaddtrack(value) {
    getInternals(this).onaddtrack = value
  }

  get onremovetrack() {
    return getInternals(this).onremovetrack
  }

  set onremovetrack(value) {
    getInternals(this).onremovetrack = value
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
    getInternals(this).removeEventListener(
      type as any,
      listener as any,
      options as any
    )
  }

  removeTrack(track: MediaStreamTrack) {
    return getInternals(this).removeTrack(track)
  }
}
