import {
  BaseMock,
  getInternals,
  MockConstructorName,
} from "@@test-utils/mockWebAudio/api/baseMock"
import {
  CURRENT_TIME_EVENT,
  MockBaseAudioContextInternals,
} from "./MockBaseAudioContextInternals"

@MockConstructorName("BaseAudioContext")
export abstract class MockBaseAudioContext<
    I extends MockBaseAudioContextInternals = MockBaseAudioContextInternals
  >
  extends BaseMock<I>
  implements BaseAudioContext
{
  constructor(_internals?: I) {
    super(_internals ?? (new MockBaseAudioContextInternals() as I))
    if (new.target === MockBaseAudioContext) {
      throw new TypeError("Illegal constructor.")
    }
  }

  addEventListener<K extends "statechange">(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    return getInternals(this).addEventListener(type, listener, options)
  }

  get audioWorklet() {
    return getInternals(this).audioWorklet
  }

  createAnalyser() {
    return getInternals(this).createAnalyser()
  }

  createAudioBufferSource() {
    return getInternals(this).createAudioBufferSource()
  }

  createBiquadFilter() {
    return getInternals(this).createBiquadFilter()
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return getInternals(this).createBuffer(numberOfChannels, length, sampleRate)
  }

  createBufferSource() {
    return getInternals(this).createBufferSource()
  }

  createChannelMerger(numberOfInputs?: number) {
    return getInternals(this).createChannelMerger(numberOfInputs)
  }

  createChannelSplitter(numberOfOutputs?: number) {
    return getInternals(this).createChannelSplitter(numberOfOutputs)
  }

  createConstantSource() {
    return getInternals(this).createConstantSource()
  }

  createConvolver() {
    return getInternals(this).createConvolver()
  }

  createDelay(maxDelayTime?: number) {
    return getInternals(this).createDelay(maxDelayTime)
  }

  createDynamicsCompressor() {
    return getInternals(this).createDynamicsCompressor()
  }

  createGain() {
    return getInternals(this).createGain()
  }

  createIIRFilter(feedback: number[], feedforward: number[]) {
    return getInternals(this).createIIRFilter(feedback, feedforward)
  }

  createOscillator() {
    return getInternals(this).createOscillator()
  }

  createPanner() {
    return getInternals(this).createPanner()
  }

  createPeriodicWave(
    real: NonNullable<PeriodicWaveOptions["real"]>,
    imag: NonNullable<PeriodicWaveOptions["imag"]>,
    constraints?: PeriodicWaveConstraints
  ) {
    return getInternals(this).createPeriodicWave(real, imag, constraints)
  }

  createScriptProcessor() {
    return getInternals(this).createScriptProcessor()
  }

  createStereoPanner() {
    return getInternals(this).createStereoPanner()
  }

  createWaveShaper() {
    return getInternals(this).createWaveShaper()
  }

  get currentTime() {
    return getInternals(this).currentTime
  }

  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: null | ((buffer: AudioBuffer) => void),
    errorCallback?: null | ((error: DOMException) => void)
  ): Promise<AudioBuffer> {
    return getInternals(this).decodeAudioData(
      audioData,
      successCallback,
      errorCallback
    )
  }

  get destination() {
    return getInternals(this).destination
  }

  dispatchEvent(event: Event): boolean {
    return getInternals(this).dispatchEvent(event)
  }

  get listener() {
    return getInternals(this).listener
  }

  get onstatechange() {
    return getInternals(this).onstatechange
  }

  set onstatechange(value) {
    getInternals(this).onstatechange = value
  }

  removeEventListener<K extends "statechange">(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return getInternals(this).removeEventListener(type, listener, options)
  }

  get sampleRate() {
    return getInternals(this).sampleRate
  }

  get state() {
    return getInternals(this).state
  }
}

export const listenToCurrentTime = (
  context: MockBaseAudioContext,
  callback: (event: Event) => void
) => {
  context.addEventListener(CURRENT_TIME_EVENT as any, callback)
}

export const unListenToCurrentTime = (
  context: MockBaseAudioContext,
  callback: (event: Event) => void
) => {
  context.removeEventListener(CURRENT_TIME_EVENT as any, callback)
}
