import { BaseMock, MockConstructorName } from "../../baseMock"
import { MockPeriodicWaveInternals } from "./MockPeriodicWaveInternals"

@MockConstructorName("PeriodicWave")
export class MockPeriodicWave
  extends BaseMock<MockPeriodicWaveInternals>
  implements PeriodicWave
{
  constructor(context: BaseAudioContext, options: PeriodicWaveOptions) {
    super(new MockPeriodicWaveInternals(context, options))
  }
}
