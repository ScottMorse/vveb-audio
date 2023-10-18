import {
  MockEnvironment,
  MockInternals,
} from "@@test-utils/mockWebAudio/api/mockFactory"

export class MockOfflineAudioCompletionEventInternals
  extends MockInternals<OfflineAudioCompletionEvent>
  implements Omit<OfflineAudioCompletionEvent, keyof Event>
{
  constructor(
    mock: OfflineAudioCompletionEvent,
    mockEnvironment: MockEnvironment,
    options: OfflineAudioCompletionEventInit,
    private _offlineCtx: OfflineAudioContext
  ) {
    super(mock, mockEnvironment)

    this._renderedBuffer = options.renderedBuffer
  }

  get currentTarget() {
    return this._offlineCtx
  }

  get renderedBuffer(): AudioBuffer {
    return this._renderedBuffer
  }

  get target() {
    return this._offlineCtx
  }

  protected _renderedBuffer: AudioBuffer
}
