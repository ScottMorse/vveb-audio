import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockOscillatorNodeInternals } from "./MockOscillatorNodeInternals"

export const createOscillatorNodeMock = createMockFactory<
  typeof OscillatorNode,
  MockOscillatorNodeInternals
>(({ getInternals, setInternals, mockEnvironment }) => {
  @MockConstructorName("OscillatorNode")
  class MockOscillatorNode
    extends mockEnvironment.api.AudioScheduledSourceNode
    implements OscillatorNode
  {
    constructor(context: BaseAudioContext, options?: OscillatorOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockOscillatorNodeInternals(this, mockEnvironment, context)
      )
    }

    get detune(): AudioParam {
      return getInternals(this).detune
    }

    get frequency(): AudioParam {
      return getInternals(this).frequency
    }

    setPeriodicWave(periodicWave: PeriodicWave) {
      return getInternals(this).setPeriodicWave(periodicWave)
    }

    get type(): OscillatorType {
      return getInternals(this).type
    }
  }

  return MockOscillatorNode
})
