import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockAnalyserNodeInternals } from "./MockAnalyserNodeInternals"

export const createAnalyserNodeMock = createMockFactory<
  typeof AnalyserNode,
  MockAnalyserNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AnalyserNode")
  class MockAnalyserNode
    extends mockEnvironment.api.AudioNode
    implements AnalyserNode
  {
    constructor(context: BaseAudioContext, options?: AnalyserOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockAnalyserNodeInternals(this, mockEnvironment, context)
      )
    }

    get fftSize(): number {
      return getInternals(this).fftSize
    }

    get frequencyBinCount(): number {
      return getInternals(this).frequencyBinCount
    }

    getByteFrequencyData(_array: Uint8Array) {
      return getInternals(this).getByteFrequencyData(_array)
    }

    getByteTimeDomainData(_array: Uint8Array) {
      return getInternals(this).getByteTimeDomainData(_array)
    }

    getFloatFrequencyData(_array: Float32Array) {
      return getInternals(this).getFloatFrequencyData(_array)
    }

    getFloatTimeDomainData(_array: Float32Array) {
      return getInternals(this).getFloatTimeDomainData(_array)
    }

    get maxDecibels(): number {
      return getInternals(this).maxDecibels
    }

    get minDecibels(): number {
      return getInternals(this).minDecibels
    }

    get smoothingTimeConstant(): number {
      return getInternals(this).smoothingTimeConstant
    }
  }
  return MockAnalyserNode
})
