import {
  MockEnvironment,
  MockInternals,
} from "@@test-utils/mockWebAudio/api/mockFactory"

export class MockMediaStreamTrackEventInternals
  extends MockInternals<MediaStreamTrackEvent>
  implements Omit<MediaStreamTrackEvent, keyof Event>
{
  constructor(
    mock: MediaStreamTrackEvent,
    mockEnvironment: MockEnvironment,
    options: MediaStreamTrackEventInit
  ) {
    super(mock, mockEnvironment)
    this._track = options.track
  }

  get currentTarget() {
    return this._track
  }

  get target() {
    return this._track
  }

  get track() {
    return this._track
  }

  protected _track: MediaStreamTrack
}
