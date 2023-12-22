import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../../mockFactory"
import { createMockAudioListener } from "../../audioListener/MockAudioListener"
import { createMockAudioDestinationNode } from "../../audioNode/destination/MockAudioDestinationNode"
import { MockBaseAudioContextInternals } from "./MockBaseAudioContextInternals"

const CURRENT_TIME_EVENT = "_currentTime"

export const createBaseAudioContextMock = createMockFactory<
  typeof BaseAudioContext,
  MockBaseAudioContextInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  const PRIVATE_PROPS_MAP = new WeakMap<
    BaseAudioContext,
    {
      destination: AudioDestinationNode
      listener: AudioListener
    }
  >()

  @MockConstructorName("BaseAudioContext")
  class MockBaseAudioContext extends EventTarget implements BaseAudioContext {
    constructor() {
      super()

      setInternals(
        this,
        new MockBaseAudioContextInternals(this, mockEnvironment)
      )

      if (this.constructor === MockBaseAudioContext) {
        throw new TypeError("Illegal constructor.")
      }

      const destination = createMockAudioDestinationNode(
        mockEnvironment.api,
        this
      )

      PRIVATE_PROPS_MAP.set(this, {
        destination,
        listener: createMockAudioListener(mockEnvironment.api, this),
      })
    }

    get audioWorklet(): AudioWorklet {
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
      return getInternals(this).createBuffer(
        numberOfChannels,
        length,
        sampleRate
      )
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
      _real: number[],
      _imag: number[],
      _constraints?: PeriodicWaveConstraints
    ) {
      /** @todo perhaps should be used for all calls to internals like this (make forwardArguments helper) */
      return getInternals(this).createPeriodicWave(
        // eslint-disable-next-line prefer-rest-params
        ...(arguments as unknown as [any, any, any])
      )
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

    get currentTime(): number {
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

    get destination(): AudioDestinationNode {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return PRIVATE_PROPS_MAP.get(this)!.destination
    }

    get listener(): AudioListener {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return PRIVATE_PROPS_MAP.get(this)!.listener
    }

    get onstatechange(): ((e: Event) => any) | null {
      return getInternals(this).onstatechange
    }

    set onstatechange(value) {
      getInternals(this).onstatechange = value
    }

    get sampleRate(): number {
      return getInternals(this).sampleRate
    }

    get state(): AudioContextState {
      return getInternals(this).state
    }
  }

  return MockBaseAudioContext
})

export const listenToCurrentTime = (
  context: BaseAudioContext,
  callback: (event: Event) => void
) => {
  context.addEventListener(CURRENT_TIME_EVENT as any, callback)
}

export const unListenToCurrentTime = (
  context: BaseAudioContext,
  callback: (event: Event) => void
) => {
  context.removeEventListener(CURRENT_TIME_EVENT as any, callback)
}
