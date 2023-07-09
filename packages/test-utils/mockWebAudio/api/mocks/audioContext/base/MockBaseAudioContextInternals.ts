import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { createMockAudioListener } from "../../audioListener/MockAudioListener"
import { createMockAudioDestinationNode } from "../../audioNode/destination/MockAudioDestinationNode"
import { getIsFourierCoefficientValid } from "../../periodicWave/fourierUtils"
import { createMockAudioWorklet } from "../../worklet"

export const CURRENT_TIME_EVENT = "_currentTime"

export class MockBaseAudioContextInternals<C extends BaseAudioContext = BaseAudioContext>
  extends MockInternals<C>
  implements BaseAudioContext
{
  readonly eventTarget = new EventTarget()

  addEventListener<K extends "statechange">(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    this.eventTarget.addEventListener(type, listener, options)
  }

  get audioWorklet() {
    return this._audioWorklet
  }

  createAnalyser() {
    return new (getEngineContext(this).mockApi.AnalyserNode)(this.mock)
  }

  createAudioBufferSource() {
    return new (getEngineContext(this).mockApi.AudioBufferSourceNode)(this.mock)
  }

  createBiquadFilter() {
    return new (getEngineContext(this).mockApi.BiquadFilterNode)(this.mock)
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new (getEngineContext(this).mockApi.AudioBuffer)({
      length,
      numberOfChannels,
      sampleRate,
    }) as unknown as AudioBuffer
  }

  createBufferSource() {
    return new (getEngineContext(this).mockApi.AudioBufferSourceNode)(this.mock)
  }

  createChannelMerger(numberOfInputs?: number) {
    return new (getEngineContext(this).mockApi.ChannelMergerNode)(this.mock, {
      numberOfInputs,
    })
  }

  createChannelSplitter(numberOfOutputs?: number) {
    return new (getEngineContext(this).mockApi.ChannelSplitterNode)(this.mock, {
      numberOfOutputs,
    })
  }

  createConstantSource() {
    return new (getEngineContext(this).mockApi.ConstantSourceNode)(this.mock)
  }

  createConvolver() {
    return new (getEngineContext(this).mockApi.ConvolverNode)(this.mock)
  }

  createDelay(maxDelayTime?: number) {
    return new (getEngineContext(this).mockApi.DelayNode)(this.mock, {
      maxDelayTime,
    })
  }

  createDynamicsCompressor() {
    return new (getEngineContext(this).mockApi.DynamicsCompressorNode)(
      this.mock
    )
  }

  createGain() {
    return new (getEngineContext(this).mockApi.GainNode)(this.mock)
  }

  createIIRFilter(feedback: number[], feedforward: number[]) {
    return new (getEngineContext(this).mockApi.IIRFilterNode)(this.mock, {
      feedback,
      feedforward,
    })
  }

  createOscillator() {
    return new (getEngineContext(this).mockApi.OscillatorNode)(this.mock)
  }

  createPanner() {
    return new (getEngineContext(this).mockApi.PannerNode)(this.mock)
  }

  createPeriodicWave(
    real: NonNullable<PeriodicWaveOptions["real"]>,
    imag: NonNullable<PeriodicWaveOptions["imag"]>,
    constraints?: PeriodicWaveConstraints
  ): PeriodicWave {
    if (arguments.length < 2) {
      throw new TypeError(
        `Failed to execute 'createPeriodicWave' on 'BaseAudioContext': 2 arguments required, but only ${arguments.length} present.`
      )
    }

    const errors: {
      [key in
        | "matchedLength"
        | "badLength"
        | "noIterator"
        | "nonFinite"]?: boolean
    } = {}
    if (
      typeof real !== "string" &&
      typeof real?.length === "number" &&
      typeof imag !== "string" &&
      typeof imag?.length === "number" &&
      real.length !== imag.length
    ) {
      errors.matchedLength = true
    }

    const { isValid: isValidReal, reason: reasonReal } =
      getIsFourierCoefficientValid(real)
    const { isValid: isValidImag, reason: reasonImag } =
      getIsFourierCoefficientValid(imag)

    if (!isValidReal) errors[reasonReal] = true
    if (!isValidImag) errors[reasonImag] = true

    if (errors.nonFinite) {
      throw new TypeError(
        "Failed to execute 'createPeriodicWave' on 'BaseAudioContext': The provided float value is non-finite."
      )
    }
    if (errors.matchedLength) {
      throw new DOMException(
        `Failed to execute 'createPeriodicWave' on 'BaseAudioContext': length of real array (${real.length}) and length of imaginary array (${imag.length}) must match.`,
        "IndexSizeError"
      )
    }
    if (errors.badLength) {
      throw new DOMException(
        `Failed to execute 'createPeriodicWave' on 'BaseAudioContext': The length of the real array provided (${real.length}) is less than the minimum bound (2).`,
        "IndexSizeError"
      )
    }
    if (errors.noIterator) {
      throw new TypeError(
        "Failed to execute 'createPeriodicWave' on 'BaseAudioContext': The provided value cannot be converted to a sequence."
      )
    }

    return new (getEngineContext(this).mockApi.PeriodicWave)(this, {
      real,
      imag,
      ...constraints,
    })
  }

  createScriptProcessor() {
    throw new Error(
      "vveb-audio does not support the deprecated createScriptProcessor(), so it is not implemented in the mock API."
    )
    return {} as any
  }

  createStereoPanner() {
    return new (getEngineContext(this).mockApi.StereoPannerNode)(this.mock)
  }

  createWaveShaper() {
    return new (getEngineContext(this).mockApi.WaveShaperNode)(this.mock)
  }

  get currentTime() {
    return this._currentTime
  }

  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: null | ((buffer: AudioBuffer) => void),
    errorCallback?: null | ((error: DOMException) => void)
  ): Promise<AudioBuffer> {
    try {
      const buffer = new (getEngineContext(this).mockApi.AudioBuffer)({
        length: audioData.byteLength,
        sampleRate: this.sampleRate,
      }) as unknown as AudioBuffer
      if (successCallback) successCallback(buffer)
      return Promise.resolve(buffer)
    } catch (e) {
      if (errorCallback) errorCallback(e as DOMException)
      return Promise.reject(e)
    }
  }

  get destination() {
    return this._destination
  }

  dispatchEvent(event: Event): boolean {
    return this.eventTarget.dispatchEvent(event)
  }

  get listener() {
    return this._listener
  }

  get onstatechange() {
    return this._onstatechange
  }

  set onstatechange(value) {
    this._onstatechange = sanitizeEventCallback(value)
  }

  removeEventListener<K extends "statechange">(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ) {
    this.eventTarget.removeEventListener(type, listener, options)
  }

  get sampleRate() {
    return this._sampleRate
  }

  get state() {
    return this._state
  }

  protected _currentTime = 0

  protected _currentPerformanceTime = 0

  protected _audioWorklet = createMockAudioWorklet(getEngineContext(this))

  protected _destination = createMockAudioDestinationNode(
    getEngineContext(this),
    this
  )

  protected _listener = createMockAudioListener(getEngineContext(this), this)

  protected _sampleRate = 44100

  protected _state: AudioContextState = "running"

  protected _onstatechange: ((e: Event) => any) | null = null

  protected _onCurrentTimeChanged() {
    this.dispatchEvent(new Event(CURRENT_TIME_EVENT))
  }
}
