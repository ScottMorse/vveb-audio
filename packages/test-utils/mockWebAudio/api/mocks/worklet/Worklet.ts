import { BaseMock, getInternals, MockInternals } from "../../baseMock"

export const ALLOW_WORKLET_CONSTRUCTOR = Symbol("ALLOW_WORKLET_CONSTRUCTOR")

class MockWorkletInternals extends MockInternals<Worklet> implements Worklet {
  addModule(_moduleURL: string | URL, _options?: WorkletOptions | undefined) {
    return Promise.resolve()
  }
}

export class MockWorklet
  extends BaseMock<MockWorkletInternals>
  implements Worklet
{
  constructor(_allow?: typeof ALLOW_WORKLET_CONSTRUCTOR) {
    super(new MockWorkletInternals())
    if (_allow !== ALLOW_WORKLET_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
  }

  addModule(_moduleURL: string | URL, _options?: WorkletOptions | undefined) {
    return getInternals(this).addModule(_moduleURL, _options)
  }
}
