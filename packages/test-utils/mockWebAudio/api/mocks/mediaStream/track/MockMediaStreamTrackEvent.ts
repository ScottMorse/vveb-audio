import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockMediaStreamTrackEventInternals } from "./MockMediaStreamTrackEventInternals"

export const createMediaStreamTrackEventMock = createMockFactory<
  typeof MediaStreamTrackEvent,
  MockMediaStreamTrackEventInternals
>(({ getInternals, setInternals, mockEnvironment }) => {
  @MockConstructorName("MediaStreamTrackEvent")
  class MockMediaStreamTrackEvent
    extends Event
    implements MediaStreamTrackEvent
  {
    constructor(type: string, eventInitDict: MediaStreamTrackEventInit) {
      super(type, {
        bubbles: false,
        composed: false,
        cancelable: false,
        ...eventInitDict,
      })
      setInternals(
        this,
        new MockMediaStreamTrackEventInternals(
          this,
          mockEnvironment,
          eventInitDict
        )
      )
    }

    get currentTarget(): MediaStreamTrack {
      return getInternals(this).currentTarget
    }

    get target(): MediaStreamTrack {
      return getInternals(this).target
    }

    get track(): MediaStreamTrack {
      return getInternals(this).track
    }
  }

  return MockMediaStreamTrackEvent
})
