import { sanitizeEventCallback } from "../../../internal/util/events"
import {
  NativeAudioBuffer,
  NativeBaseAudioContext,
} from "../../../internal/util/nativeTypes"
import { AudioBuffer } from "../../audioBuffer"
import { createGlobalAudioListener } from "../../audioListener"
import {
  MOCK_AUDIO_NODE_SUBCLASSES,
  ScriptProcessorNode,
} from "../../audioNode"
import { createMockAudioDestinationNode } from "../../audioNode/mocks/AudioDestinationNode"
import {
  getIsFourierCoefficientValid,
  PeriodicWave,
} from "../../periodicWave/mocks"
import { createMockAudioWorklet } from "../../worklet"

const CURRENT_TIME_EVENT = "_currentTime"

export abstract class BaseAudioContext
  extends EventTarget
  implements NativeBaseAudioContext
{
  constructor() {
    super()
    if (this.constructor === BaseAudioContext) {
      throw new TypeError("Illegal constructor.")
    }
  }

  get audioWorklet() {
    return this._audioWorklet
  }

  createAnalyser() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.analyser.cls(
      this
    ) as unknown as AnalyserNode
  }

  createAudioBufferSource() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.audioBufferSource.cls(
      this
    ) as unknown as AudioBufferSourceNode
  }

  createBiquadFilter() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.biquadFilter.cls(
      this
    ) as unknown as BiquadFilterNode
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new AudioBuffer({
      length,
      numberOfChannels,
      sampleRate,
    }) as unknown as NativeAudioBuffer
  }

  createBufferSource() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.audioBufferSource.cls(
      this
    ) as unknown as AudioBufferSourceNode
  }

  createChannelMerger(numberOfInputs?: number) {
    return new MOCK_AUDIO_NODE_SUBCLASSES.channelMerger.cls(this, {
      numberOfInputs,
    }) as unknown as ChannelMergerNode
  }

  createChannelSplitter(numberOfOutputs?: number) {
    return new MOCK_AUDIO_NODE_SUBCLASSES.channelSplitter.cls(this, {
      numberOfOutputs,
    }) as unknown as ChannelSplitterNode
  }

  createConstantSource() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.constantSource.cls(
      this
    ) as unknown as ConstantSourceNode
  }

  createConvolver() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.convolver.cls(
      this
    ) as unknown as ConvolverNode
  }

  createDelay(maxDelayTime?: number) {
    return new MOCK_AUDIO_NODE_SUBCLASSES.delay.cls(this, {
      maxDelayTime,
    }) as unknown as DelayNode
  }

  createDynamicsCompressor() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.dynamicsCompressor.cls(
      this
    ) as unknown as DynamicsCompressorNode
  }

  createGain() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.gain.cls(this) as unknown as GainNode
  }

  createIIRFilter(feedback: number[], feedforward: number[]) {
    /** @todo how (if at all) should these args be used? */
    return new MOCK_AUDIO_NODE_SUBCLASSES.iirFilter.cls(this, {
      feedback,
      feedforward,
    }) as unknown as IIRFilterNode
  }

  createOscillator() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.oscillator.cls(
      this
    ) as unknown as OscillatorNode
  }

  createPanner() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.panner.cls(
      this
    ) as unknown as PannerNode
  }

  createPeriodicWave(
    real: NonNullable<PeriodicWaveOptions["real"]>,
    imag: NonNullable<PeriodicWaveOptions["imag"]>,
    constraints?: PeriodicWaveConstraints
  ) {
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

    return new PeriodicWave(this as unknown as NativeBaseAudioContext, {
      real,
      imag,
      ...constraints,
    })
  }

  createScriptProcessor(
    _bufferSize: number,
    _numberOfInputChannels?: number,
    _numberOfOutputChannels?: number
  ) {
    /** @todo How (if at all) should these args be used? */
    return new MOCK_AUDIO_NODE_SUBCLASSES.scriptProcessor.cls(
      this
    ) as unknown as ScriptProcessorNode
  }

  createStereoPanner() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.stereoPanner.cls(
      this
    ) as unknown as StereoPannerNode
  }

  createWaveShaper() {
    return new MOCK_AUDIO_NODE_SUBCLASSES.waveShaper.cls(
      this
    ) as unknown as WaveShaperNode
  }

  get currentTime() {
    return this._currentTime
  }

  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: (buffer: NativeAudioBuffer) => void,
    errorCallback?: (error: Error) => void
  ): Promise<NativeAudioBuffer> {
    try {
      const buffer = new AudioBuffer({
        length: audioData.byteLength,
        sampleRate: this.sampleRate,
      }) as unknown as NativeAudioBuffer
      if (successCallback) successCallback(buffer)
      return Promise.resolve(buffer)
    } catch (e) {
      if (errorCallback) errorCallback(e as Error)
      return Promise.reject(e)
    }
  }

  get destination() {
    return this._destination
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

  get sampleRate() {
    return this._sampleRate
  }

  get state() {
    return this._state
  }

  protected _currentTime = 0

  protected _currentPerformanceTime = 0

  protected _audioWorklet = createMockAudioWorklet()

  protected _destination = createMockAudioDestinationNode(this)

  protected _listener = createGlobalAudioListener(this)

  protected _sampleRate = 44100

  protected _state: AudioContextState = "running"

  protected _onstatechange: ((e: Event) => any) | null = null

  protected _onCurrentTimeChanged() {
    this.dispatchEvent(new Event(CURRENT_TIME_EVENT))
  }
}

export const listenToCurrentTime = (
  context: BaseAudioContext,
  callback: (event: Event) => void
) => {
  context.addEventListener(CURRENT_TIME_EVENT, callback)
}

export const unListenToCurrentTime = (
  context: BaseAudioContext,
  callback: (event: Event) => void
) => {
  context.removeEventListener(CURRENT_TIME_EVENT, callback)
}
