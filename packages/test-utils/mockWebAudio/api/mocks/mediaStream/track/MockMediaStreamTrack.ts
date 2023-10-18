import {
  createMockFactory,
  MockWebAudioApi,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import {
  MockMediaStreamTrackInternals,
  MediaStreamTrackOptions,
} from "./MockMediaStreamTrackInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createMediaStreamTrackMock = createMockFactory<
  typeof MediaStreamTrack,
  MockMediaStreamTrackInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("MediaStreamTrack")
  class MockMediaStreamTrack extends EventTarget implements MediaStreamTrack {
    constructor(
      options?: MediaStreamTrackOptions,
      allow?: typeof ALLOW_CONSTRUCTOR
    ) {
      if (allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }

      super()
      setInternals(
        this,
        new MockMediaStreamTrackInternals(this, mockEnvironment, options)
      )
    }

    applyConstraints(
      constraints?: MediaTrackConstraints | undefined
    ): Promise<void> {
      return getInternals(this).applyConstraints(constraints)
    }

    clone(): MediaStreamTrack {
      return new mockEnvironment.api.MediaStreamTrack(
        ...([
          {
            kind: this.kind,
            label: this.label,
            muted: this.muted,
            readyState: this.readyState,
            constraints: this.getConstraints(),
            contentHint: this.contentHint,
          },
        ] as unknown as [])
      )
    }

    get contentHint(): string {
      return getInternals(this).contentHint
    }

    get enabled(): boolean {
      return getInternals(this).enabled
    }

    set enabled(value) {
      getInternals(this).enabled = value
    }

    getCapabilities() {
      return getInternals(this).getCapabilities()
    }

    getConstraints() {
      return getInternals(this).getConstraints()
    }

    getSettings() {
      return getInternals(this).getSettings()
    }

    get id(): string {
      return getInternals(this).id
    }

    get kind(): string {
      return getInternals(this).kind
    }

    get label(): string {
      return getInternals(this).label
    }

    get muted(): boolean {
      return getInternals(this).muted
    }

    get onended(): ((this: MediaStreamTrack, ev: Event) => any) | null {
      return getInternals(this).onended
    }

    set onended(value) {
      getInternals(this).onended = value
    }

    get onmute(): ((this: MediaStreamTrack, ev: Event) => any) | null {
      return getInternals(this).onmute
    }

    set onmute(value) {
      getInternals(this).onmute = value
    }

    get onunmute(): ((this: MediaStreamTrack, ev: Event) => any) | null {
      return getInternals(this).onunmute
    }

    set onunmute(value) {
      getInternals(this).onunmute = value
    }

    get readyState(): MediaStreamTrackState {
      return getInternals(this).readyState
    }

    stop() {
      return getInternals(this).stop()
    }
  }

  return MockMediaStreamTrack
})

export const createMockMediaStreamTrack = (
  api: MockWebAudioApi,
  options?: MediaStreamTrackOptions
) =>
  new api.MediaStreamTrack(...([options, ALLOW_CONSTRUCTOR] as unknown as []))
