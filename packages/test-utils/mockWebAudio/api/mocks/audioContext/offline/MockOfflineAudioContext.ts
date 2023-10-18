import { ValidateClassArgsLength } from "@@test-utils/mockWebAudio/util/arguments"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../../mockFactory"
import { MockOfflineAudioContextInternals } from "./MockOfflineAudioContextInternals"

export const createOfflineAudioContextMock = createMockFactory<
  typeof OfflineAudioContext,
  MockOfflineAudioContextInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @ValidateClassArgsLength(1)
  @MockConstructorName("OfflineAudioContext")
  class MockOfflineAudioContext
    extends mockEnvironment.api.BaseAudioContext
    implements OfflineAudioContext
  {
    constructor(
      arg1: number | OfflineAudioContextOptions,
      length?: number,
      sampleRate?: number
    ) {
      super()
      setInternals(
        this,
        new MockOfflineAudioContextInternals(
          this,
          mockEnvironment,
          arg1 as number,
          length as number,
          sampleRate as number,
          arguments.length,
        )
      )
    }

    get length(): number {
      return getInternals(this).length
    }

    get oncomplete(): ((e: OfflineAudioCompletionEvent) => any) | null {
      return getInternals(this).oncomplete
    }

    set oncomplete(value) {
      getInternals(this).oncomplete = value
    }

    resume() {
      return getInternals(this).resume()
    }

    startRendering() {
      return getInternals(this).startRendering()
    }

    suspend(time: number) {
      return getInternals(this).suspend(time)
    }
  }

  return MockOfflineAudioContext
})
