import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { ValidateMethodArgsLength } from "@@test-utils/mockWebAudio/util/arguments"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockMediaStreamInternals } from "./MockMediaStreamInternals"

export const createMediaStreamMock = createMockFactory<
  typeof MediaStream,
  MockMediaStreamInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("MediaStream")
  class MockMediaStream extends EventTarget implements MediaStream {
    constructor(streamOrTracks?: MediaStream | MediaStreamTrack[]) {
      super()
      setInternals(
        this,
        new MockMediaStreamInternals(this, mockEnvironment, streamOrTracks)
      )
    }

    get active(): boolean {
      return getInternals(this).active
    }

    @ValidateMethodArgsLength(1)
    addTrack(track: MediaStreamTrack) {
      getInternals(this).addTrack(track)
    }

    clone() {
      return getInternals(this).clone()
    }

    getAudioTracks() {
      return getInternals(this).getAudioTracks()
    }

    @ValidateMethodArgsLength(1)
    getTrackById(trackId: string) {
      return getInternals(this).getTrackById(trackId)
    }

    getTracks() {
      return getInternals(this).getTracks()
    }

    getVideoTracks() {
      return getInternals(this).getVideoTracks()
    }

    get id(): string {
      return getInternals(this).id
    }

    get onactive(): ((this: MediaStream, ev: Event) => any) | null {
      return getInternals(this).onactive
    }

    set onactive(value) {
      getInternals(this).onactive = value as any
    }

    get onaddtrack():
      | ((this: MediaStream, ev: MediaStreamTrackEvent) => any)
      | null {
      return getInternals(this).onaddtrack
    }

    set onaddtrack(value) {
      getInternals(this).onaddtrack = value as any
    }

    get onremovetrack():
      | ((this: MediaStream, ev: MediaStreamTrackEvent) => any)
      | null {
      return getInternals(this).onremovetrack
    }

    set onremovetrack(value) {
      getInternals(this).onremovetrack = value as any
    }

    @ValidateMethodArgsLength(1)
    removeTrack(track: MediaStreamTrack) {
      return getInternals(this).removeTrack(track)
    }
  }

  return MockMediaStream
})
