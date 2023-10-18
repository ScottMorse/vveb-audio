import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../../mockFactory"
import { MockOfflineAudioCompletionEventInternals } from "./MockOfflineAudioCompletionEventInternals"

export const createOfflineAudioCompletionEventMock = createMockFactory<
  typeof OfflineAudioCompletionEvent,
  MockOfflineAudioCompletionEventInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("OfflineAudioCompletionEvent")
  class MockOfflineAudioCompletionEvent
    extends Event
    implements OfflineAudioCompletionEvent
  {
    constructor(
      type: string,
      options: { renderedBuffer: AudioBuffer },
      _offlineCtx: OfflineAudioContext
    ) {
      super(type, {
        bubbles: true,
        cancelable: false,
        composed: false,
      })
      setInternals(
        this,
        new MockOfflineAudioCompletionEventInternals(
          this,
          mockEnvironment,
          options,
          _offlineCtx
        )
      )
    }

    get currentTarget(): OfflineAudioContext {
      return getInternals(this).currentTarget
    }

    get renderedBuffer(): AudioBuffer {
      return getInternals(this).renderedBuffer
    }

    get target(): OfflineAudioContext {
      return getInternals(this).target
    }
  }

  return MockOfflineAudioCompletionEvent as unknown as typeof OfflineAudioCompletionEvent
})
