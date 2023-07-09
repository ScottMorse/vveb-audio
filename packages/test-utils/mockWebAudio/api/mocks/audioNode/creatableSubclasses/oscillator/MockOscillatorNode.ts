import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioScheduledSourceNode } from "../../scheduledSource"
import { MockOscillatorNodeInternals } from "./MockOscillatorNodeInternals"

export class MockOscillatorNode
  extends MockAudioScheduledSourceNode<MockOscillatorNodeInternals>
  implements OscillatorNode
{
  constructor(context: BaseAudioContext, options?: OscillatorOptions) {
    super(context, new MockOscillatorNodeInternals(context, options))
  }

  get detune() {
    return getInternals(this).detune
  }

  get frequency() {
    return getInternals(this).frequency
  }

  setPeriodicWave(periodicWave: PeriodicWave) {
    return getInternals(this).setPeriodicWave(periodicWave)
  }

  get type() {
    return getInternals(this).type
  }
}
