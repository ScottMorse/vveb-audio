import { ValidateClassArgsLength } from "@@test-utils/mockWebAudio/util/arguments"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../mockFactory"
import { MockPeriodicWaveInternals } from "./MockPeriodicWaveInternals"

export const createPeriodicWaveMock = createMockFactory<
  typeof PeriodicWave,
  MockPeriodicWaveInternals
>(({ setInternals, mockEnvironment }) => {
  @ValidateClassArgsLength(1)
  @MockConstructorName("PeriodicWave")
  class MockPeriodicWave implements PeriodicWave {
    constructor(context: BaseAudioContext, options?: PeriodicWaveOptions) {
      setInternals(
        this,
        new MockPeriodicWaveInternals(this, mockEnvironment, context, options)
      )
    }
  }

  return MockPeriodicWave
})
