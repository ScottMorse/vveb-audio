import { MockInternals } from "@@test-utils/mockWebAudio/api/mockFactory"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { getIsFourierCoefficientValid } from "../../periodicWave/fourierUtils"
import { createMockAudioWorklet } from "../../worklet"

export const CURRENT_TIME_EVENT = "_currentTime"

export class MockBaseAudioContextInternals<
    C extends BaseAudioContext = BaseAudioContext
  >
  extends MockInternals<C>
  implements
    Omit<BaseAudioContext, keyof EventTarget | "listener" | "destination">
{
  get audioWorklet() {
    return this._audioWorklet
  }

  createAnalyser() {
    return new this.mockEnvironment.api.AnalyserNode(this.mock)
  }

  createAudioBufferSource() {
    return new this.mockEnvironment.api.AudioBufferSourceNode(this.mock)
  }

  createBiquadFilter() {
    return new this.mockEnvironment.api.BiquadFilterNode(this.mock)
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new this.mockEnvironment.api.AudioBuffer({
      length,
      numberOfChannels,
      sampleRate,
    }) as unknown as AudioBuffer
  }

  createBufferSource() {
    return new this.mockEnvironment.api.AudioBufferSourceNode(this.mock)
  }

  createChannelMerger(numberOfInputs?: number) {
    return new this.mockEnvironment.api.ChannelMergerNode(this.mock, {
      numberOfInputs,
    })
  }

  createChannelSplitter(numberOfOutputs?: number) {
    return new this.mockEnvironment.api.ChannelSplitterNode(this.mock, {
      numberOfOutputs,
    })
  }

  createConstantSource() {
    return new this.mockEnvironment.api.ConstantSourceNode(this.mock)
  }

  createConvolver() {
    return new this.mockEnvironment.api.ConvolverNode(this.mock)
  }

  createDelay(maxDelayTime?: number) {
    return new this.mockEnvironment.api.DelayNode(this.mock, {
      maxDelayTime,
    })
  }

  createDynamicsCompressor() {
    return new this.mockEnvironment.api.DynamicsCompressorNode(this.mock)
  }

  createGain() {
    return new this.mockEnvironment.api.GainNode(this.mock)
  }

  createIIRFilter(feedback: number[], feedforward: number[]) {
    return new this.mockEnvironment.api.IIRFilterNode(this.mock, {
      feedback,
      feedforward,
    })
  }

  createOscillator() {
    return new this.mockEnvironment.api.OscillatorNode(this.mock)
  }

  createPanner() {
    return new this.mockEnvironment.api.PannerNode(this.mock)
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
      const errorObj = isValidReal ? imag : real
      throw new TypeError(
        !!errorObj &&
        (typeof errorObj === "object" || typeof errorObj === "function")
          ? "Failed to execute 'createPeriodicWave' on 'BaseAudioContext': The object must have a callable @@iterator property."
          : "Failed to execute 'createPeriodicWave' on 'BaseAudioContext': The provided value cannot be converted to a sequence."
      )
    }

    return new this.mockEnvironment.api.PeriodicWave(this.mock, {
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
    return new this.mockEnvironment.api.StereoPannerNode(this.mock)
  }

  createWaveShaper() {
    return new this.mockEnvironment.api.WaveShaperNode(this.mock)
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
      const buffer = new this.mockEnvironment.api.AudioBuffer({
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

  get onstatechange() {
    return this._onstatechange
  }

  set onstatechange(value) {
    this._onstatechange = sanitizeEventCallback(value)
  }

  get sampleRate() {
    return this._sampleRate
  }

  get state() {
    return this._state
  }

  protected _currentTime = 0

  protected _currentPerformanceTime = 0

  protected _audioWorklet = createMockAudioWorklet(this.mockEnvironment.api)

  protected _sampleRate = 44100

  protected _state: AudioContextState = "running"

  protected _onstatechange: ((e: Event) => any) | null = null

  protected _onCurrentTimeChanged() {
    this.mock.dispatchEvent(new Event(CURRENT_TIME_EVENT))
  }
}
