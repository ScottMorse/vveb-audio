import { BaseMock, getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import {
  EngineContext,
  getEngineContext,
} from "@@test-utils/mockWebAudio/engine/engineContext"
import {
  MediaStreamTrackOptions,
  MockMediaStreamTrackInternals,
} from "./MockMediaStreamTrackInternals"

const ALLOW_MEDIA_STREAM_TRACK_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export class MockMediaStreamTrack
  extends BaseMock<MockMediaStreamTrackInternals>
  implements MediaStreamTrack
{
  constructor(
    options?: MediaStreamTrackOptions,
    _allow?: typeof ALLOW_MEDIA_STREAM_TRACK_CONSTRUCTOR
  ) {
    super(new MockMediaStreamTrackInternals())
    if (_allow !== ALLOW_MEDIA_STREAM_TRACK_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
  }

  addEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    return getInternals(this).addEventListener(type, listener, options)
  }

  applyConstraints(
    constraints?: MediaTrackConstraints | undefined
  ): Promise<void> {
    return getInternals(this).applyConstraints(constraints)
  }

  clone() {
    return new (getEngineContext(this).mockApi.MediaStreamTrack)(
      {
        kind: this.kind as MediaStreamTrackOptions["kind"],
        label: this.label,
        muted: this.muted,
        readyState: this.readyState,
        constraints: this.getConstraints(),
        contentHint: this.contentHint as MediaStreamTrackOptions["contentHint"],
      },
      ALLOW_MEDIA_STREAM_TRACK_CONSTRUCTOR
    )
  }

  get contentHint() {
    return getInternals(this).contentHint
  }

  dispatchEvent(event: Event) {
    return getInternals(this).dispatchEvent(event)
  }

  get enabled() {
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

  get id() {
    return getInternals(this).id
  }

  get kind() {
    return getInternals(this).kind
  }

  get label() {
    return getInternals(this).label
  }

  get muted() {
    return getInternals(this).muted
  }

  get onended() {
    return getInternals(this).onended
  }

  set onended(value) {
    getInternals(this).onended = value
  }

  get onmute() {
    return getInternals(this).onmute
  }

  set onmute(value) {
    getInternals(this).onmute = value
  }

  get onunmute() {
    return getInternals(this).onunmute
  }

  set onunmute(value) {
    getInternals(this).onunmute = value
  }

  get readyState() {
    return getInternals(this).readyState
  }

  removeEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return getInternals(this).removeEventListener(type, listener, options)
  }

  stop() {
    return getInternals(this).stop()
  }
}

export const createMockMediaStreamTrack = (
  engineContext: EngineContext,
  options?: MediaStreamTrackOptions
) =>
  new engineContext.mockApi.MediaStreamTrack(
    options,
    ALLOW_MEDIA_STREAM_TRACK_CONSTRUCTOR
  )
