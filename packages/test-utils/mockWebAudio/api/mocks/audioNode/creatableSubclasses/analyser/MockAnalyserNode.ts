import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockAnalyserNodeInternals } from "./MockAnalyserNodeInternals"

export class MockAnalyserNode
  extends MockAudioNode<MockAnalyserNodeInternals>
  implements AnalyserNode
{
  constructor(context: BaseAudioContext, options?: AnalyserOptions) {
    super(context, options, new MockAnalyserNodeInternals(context, options))
  }

  get fftSize() {
    return getInternals(this).fftSize
  }

  get frequencyBinCount() {
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

  get maxDecibels() {
    return getInternals(this).maxDecibels
  }

  get minDecibels() {
    return getInternals(this).minDecibels
  }

  get smoothingTimeConstant() {
    return getInternals(this).smoothingTimeConstant
  }
}
