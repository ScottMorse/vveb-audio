import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { Mixin } from "ts-mixer"

export class MockOfflineAudioCompletionEventInternals extends Mixin(
  Event,
  MockInternals<OfflineAudioCompletionEvent>
) {
  constructor(
    type: string,
    options: { renderedBuffer: AudioBuffer },
    private _offlineCtx: OfflineAudioContext
  ) {
    super(type, {
      bubbles: true,
      cancelable: false,
      composed: false,
    })
    this._renderedBuffer = options.renderedBuffer
  }

  get currentTarget() {
    return this._offlineCtx
  }

  get renderedBuffer(): AudioBuffer {
    return this._renderedBuffer
  }

  set renderedBuffer(value: AudioBuffer) {
    this._renderedBuffer = value
  }

  get srcElement() {
    return this._offlineCtx
  }

  get target() {
    return this._offlineCtx
  }

  private _renderedBuffer: AudioBuffer
}
