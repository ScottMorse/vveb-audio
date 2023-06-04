import { AudioNodeClassOptions } from "@@core/native/audioNode"
import type { CreatableAudioNodeName } from "@@core/native/audioNode/createAudioNode"
import { sanitizeEventCallback } from "../../../internal/util/events"
import * as ClassTypes from "../../../internal/util/nativeTypes"
import { BaseAudioContext } from "../../audioContext"
import { createMockAudioParam } from "../../audioParam/mocks/AudioParam"
import { AudioNode } from "./AudioNode"

export const MOCK_AUDIO_NODE_SUBCLASSES: {
  [key in CreatableAudioNodeName]: {
    cls: new (
      context: BaseAudioContext,
      ...[options]: undefined extends AudioNodeClassOptions<key>
        ? [options?: AudioNodeClassOptions<key>]
        : [options: AudioNodeClassOptions<key>]
    ) => AudioNode
  }
} = {
  analyser: {
    cls: class AnalyserNode
      extends AudioNode
      implements ClassTypes.NativeAnalyserNode
    {
      get fftSize() {
        return this._fftSize
      }

      get frequencyBinCount() {
        return this._frequencyBinCount
      }

      getByteFrequencyData(_array: Uint8Array) {}

      getByteTimeDomainData(_array: Uint8Array) {}

      getFloatFrequencyData(_array: Float32Array) {}

      getFloatTimeDomainData(_array: Float32Array) {}

      get maxDecibels() {
        return this._maxDecibels
      }

      get minDecibels() {
        return this._minDecibels
      }

      get smoothingTimeConstant() {
        return this._smoothingTimeConstant
      }

      protected _fftSize = 2048

      protected _frequencyBinCount = 1024

      protected _maxDecibels = -30

      protected _minDecibels = -100

      protected _smoothingTimeConstant = 0.8

      protected _channelCount = 2
    },
  },
  audioBufferSource: {
    cls: class AudioBufferSourceNode
      extends AudioNode
      implements ClassTypes.NativeAudioBufferSourceNode
    {
      get buffer() {
        return this._buffer
      }

      get channelCount() {
        return this._channelCount
      }

      get detune() {
        return this._detune
      }

      get loop() {
        return this._loop
      }

      get loopEnd() {
        return this._loopEnd
      }

      get loopStart() {
        return this._loopStart
      }

      get numberOfInputs() {
        return 0
      }

      get onended() {
        return this._onended
      }

      set onended(value) {
        this._onended = sanitizeEventCallback(value)
      }

      get playbackRate() {
        return this._playbackRate
      }

      start(_when?: number, _offset?: number, _duration?: number) {}

      stop(_when?: number) {}

      protected _onended: ((this: any, ev: Event) => any) | null = null

      protected _buffer: AudioBuffer | null = null

      protected _detune = createMockAudioParam(this.context, {
        defaultValue: 0,
      })

      protected _loop = false

      protected _loopEnd = 0

      protected _loopStart = 0

      protected _playbackRate = createMockAudioParam(this.context, {
        defaultValue: 1,
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
        automationRate: "k-rate",
      })

      protected _channelCount = 2
    },
  },
  audioScheduledSource: {
    cls: class AudioScheduledSourceNode
      extends AudioNode
      implements ClassTypes.NativeAudioScheduledSourceNode
    {
      constructor() {
        super(undefined as any)
      }

      get onended() {
        return this._onended
      }

      set onended(value) {
        this._onended = sanitizeEventCallback(value)
      }

      start(_when?: number) {}

      stop(_when?: number) {}

      protected _onended: ((this: any, ev: Event) => any) | null = null
    },
  },
  biquadFilter: {
    cls: class BiquadFilterNode
      extends AudioNode
      implements ClassTypes.NativeBiquadFilterNode
    {
      get channelCount() {
        return this._channelCount
      }

      get detune() {
        return this._detune
      }

      get frequency() {
        return this._frequency
      }

      get gain() {
        return this._gain
      }

      getFrequencyResponse(
        _frequencyHz: Float32Array,
        _magResponse: Float32Array,
        _phaseResponse: Float32Array
      ): void {}

      get Q() {
        return this._Q
      }

      get type() {
        return this._type
      }

      protected _detune = createMockAudioParam(this.context, {
        minValue: -153600,
        maxValue: 153600,
      })

      protected _frequency = createMockAudioParam(this.context, {
        defaultValue: 350,
        minValue: 0,
        maxValue: 22050,
      })

      protected _gain = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 1541.273681640625,
      })

      protected _Q = createMockAudioParam(this.context, {
        defaultValue: 1,
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _type: BiquadFilterType = "lowpass"

      protected _channelCount = 2
    },
  },

  channelMerger: {
    cls: class ChannelMergerNode
      extends AudioNode
      implements ClassTypes.NativeChannelMergerNode
    {
      get numberOfInputs() {
        return 6
      }

      protected _channelCountMode = "explicit" as const
    },
  },
  channelSplitter: {
    cls: class ChannelSplitterNode
      extends AudioNode
      implements ClassTypes.NativeChannelSplitterNode
    {
      get numberOfOutputs() {
        return 6
      }

      protected _channelCountMode = "explicit" as const

      protected _channelInterpretation = "discrete" as const

      protected _channelCount = 6
    },
  },
  constantSource: {
    cls: class ConstantSourceNode
      extends AudioNode
      implements ClassTypes.NativeConstantSourceNode
    {
      constructor(context: BaseAudioContext, options?: ConstantSourceOptions) {
        super(context)
        if (options?.offset !== undefined) {
          this._offset = createMockAudioParam(this.context, {
            value: options.offset,
            defaultValue: 1,
          })
        }
      }

      get channelCount() {
        return this._channelCount
      }

      get numberOfInputs() {
        return 0
      }

      get offset() {
        return this._offset
      }

      get onended() {
        return this._onended
      }

      set onended(value) {
        this._onended = sanitizeEventCallback(value)
      }

      start(_when?: number) {}

      stop(_when?: number) {}

      protected _onended: ((this: any, ev: Event) => any) | null = null

      protected _offset = createMockAudioParam(this.context, {
        defaultValue: 1,
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _channelCount = 2
    },
  },
  convolver: {
    cls: class ConvolverNode
      extends AudioNode
      implements ClassTypes.NativeConvolverNode
    {
      get buffer() {
        return this._buffer
      }

      get normalize() {
        return this._normalize
      }

      protected _buffer: AudioBuffer | null = null

      protected _normalize = false

      protected _channelCountMode = "clamped-max" as const

      protected _channelCount = 2
    },
  },
  delay: {
    cls: class DelayNode
      extends AudioNode
      implements ClassTypes.NativeDelayNode
    {
      get delayTime() {
        return this._delayTime
      }

      protected _delayTime = createMockAudioParam(this.context)

      protected _channelCount = 2
    },
  },
  dynamicsCompressor: {
    cls: class DynamicsCompressorNode
      extends AudioNode
      implements ClassTypes.NativeDynamicsCompressorNode
    {
      get attack() {
        return this._attack
      }

      get channelCount() {
        return this._channelCount
      }

      get channelCountMode() {
        return this._channelCountMode
      }

      get knee() {
        return this._knee
      }

      get ratio() {
        return this._ratio
      }

      get reduction() {
        return this._reduction
      }

      get release() {
        return this._release
      }

      get threshold() {
        return this._threshold
      }

      protected _attack = createMockAudioParam(this.context, {
        defaultValue: 0.003000000026077032,
        automationRate: "k-rate",
      })

      protected _knee = createMockAudioParam(this.context, {
        defaultValue: 30,
        maxValue: 40,
        automationRate: "k-rate",
      })

      protected _ratio = createMockAudioParam(this.context, {
        defaultValue: 12,
        minValue: 1,
        maxValue: 20,
        automationRate: "k-rate",
      })

      protected _reduction = 0

      protected _release = createMockAudioParam(this.context, {
        defaultValue: 0.25,
        automationRate: "k-rate",
      })

      protected _threshold = createMockAudioParam(this.context, {
        defaultValue: -24,
        minValue: -100,
        maxValue: 0,
        automationRate: "k-rate",
      })

      protected _channelCountMode = "clamped-max" as const

      protected _channelCount = 2
    },
  },

  gain: {
    cls: class GainNode extends AudioNode implements ClassTypes.NativeGainNode {
      get gain() {
        return this._gain
      }

      protected _gain = createMockAudioParam(this.context, {
        defaultValue: 1,
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _channelCount = 2
    },
  },
  iirFilter: {
    cls: class IIRFilterNode
      extends AudioNode
      implements ClassTypes.NativeIIRFilterNode
    {
      getFrequencyResponse(
        _frequencyHz: Float32Array,
        _magResponse: Float32Array,
        _phaseResponse: Float32Array
      ): void {}

      protected _channelCount = 2
    },
  },
  mediaElementAudioSource: {
    cls: class MediaElementAudioSourceNode
      extends AudioNode
      implements ClassTypes.NativeMediaElementAudioSourceNode
    {
      constructor(
        context: BaseAudioContext,
        options: MediaElementAudioSourceOptions
      ) {
        super(context, options)
        this._mediaElement = options?.mediaElement
      }

      get mediaElement() {
        return this._mediaElement
      }

      get numberOfInputs() {
        return 0
      }

      protected _mediaElement: HTMLMediaElement

      protected _channelCount = 2
    },
  },
  mediaStreamAudioDestination: {
    cls: class MediaStreamAudioDestinationNode
      extends AudioNode
      implements ClassTypes.NativeMediaStreamAudioDestinationNode
    {
      get numberOfOutputs() {
        return 0
      }

      get stream() {
        return this._stream
      }

      protected _stream = new MediaStream()

      protected _channelCountMode = "explicit" as const

      protected _channelCount = 2
    },
  },
  mediaStreamAudioSource: {
    /** @todo notes throws if MediaStream has no audio track */
    cls: class MediaStreamAudioSourceNode
      extends AudioNode
      implements ClassTypes.NativeMediaStreamAudioSourceNode
    {
      constructor(
        context: BaseAudioContext,
        options: { mediaStream: MediaStream }
      ) {
        super(context, options)
        this._mediaStream = options.mediaStream
      }

      get mediaStream() {
        return this._mediaStream
      }

      get numberOfInputs() {
        return 0
      }

      protected _mediaStream: MediaStream

      protected _channelCount = 2
    },
  },
  oscillator: {
    cls: class OscillatorNode
      extends AudioNode
      implements ClassTypes.NativeOscillatorNode
    {
      get channelCount() {
        return this._channelCount
      }

      get detune() {
        return this._detune
      }

      get frequency() {
        return this._frequency
      }

      get numberOfInputs() {
        return 0
      }

      get onended() {
        return this._onended
      }

      set onended(value) {
        this._onended = sanitizeEventCallback(value)
      }

      setPeriodicWave(_periodicWave: PeriodicWave): void {}

      start(_when?: number) {}

      stop(_when?: number) {}

      get type() {
        return this._type
      }

      protected _detune = createMockAudioParam(this.context, {
        defaultValue: 0,
        minValue: -153600,
        maxValue: 153600,
      })

      protected _frequency = createMockAudioParam(this.context, {
        defaultValue: 440,
        minValue: -22050,
        maxValue: 22050,
      })

      protected _type: OscillatorType = "sine"

      protected _channelCount = 2

      protected _onended: ((this: any, ev: Event) => any) | null = null
    },
  },
  panner: {
    cls: class PannerNode
      extends AudioNode
      implements ClassTypes.NativePannerNode
    {
      get channelCount() {
        return this._channelCount
      }

      get channelCountMode() {
        return this._channelCountMode
      }

      get coneInnerAngle() {
        return this._coneInnerAngle
      }

      get coneOuterAngle() {
        return this._coneOuterAngle
      }

      get coneOuterGain() {
        return this._coneOuterGain
      }

      get distanceModel() {
        return this._distanceModel
      }

      get maxDistance() {
        return this._maxDistance
      }

      get orientationX() {
        return this._orientationX
      }

      get orientationY() {
        return this._orientationY
      }

      get orientationZ() {
        return this._orientationZ
      }

      get panningModel() {
        return this._panningModel
      }

      get positionX() {
        return this._positionX
      }

      get positionY() {
        return this._positionY
      }

      get positionZ() {
        return this._positionZ
      }

      get refDistance() {
        return this._refDistance
      }

      get rolloffFactor() {
        return this._rolloffFactor
      }

      /** @todo check how these methods may affect other properties */
      setOrientation(_x: number, _y: number, _z: number): void {}

      setPosition(_x: number, _y: number, _z: number): void {}

      setVelocity(_x: number, _y: number, _z: number): void {}

      protected _coneInnerAngle = 360

      protected _coneOuterAngle = 360

      protected _coneOuterGain = 0

      protected _distanceModel: DistanceModelType = "inverse"

      protected _maxDistance = 10000

      protected _orientationX = createMockAudioParam(this.context, {
        defaultValue: 1,
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _orientationY = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _orientationZ = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _panningModel: PanningModelType = "equalpower"

      protected _positionX = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _positionY = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _positionZ = createMockAudioParam(this.context, {
        minValue: -3.4028234663852886e38,
        maxValue: 3.4028234663852886e38,
      })

      protected _refDistance = 1

      protected _rolloffFactor = 1

      protected _channelCountMode = "clamped-max" as const

      protected _channelCount = 2
    },
  },
  scriptProcessor: {
    cls: class ScriptProcessorNode
      extends AudioNode
      implements ClassTypes.NativeScriptProcessorNode
    {
      get bufferSize() {
        return this._bufferSize
      }

      get onaudioprocess() {
        return this._onaudioprocess
      }

      set onaudioprocess(value) {
        this._onaudioprocess = sanitizeEventCallback(value)
      }

      protected _bufferSize = 0

      protected _onaudioprocess:
        | ((this: any, ev: AudioProcessingEvent) => any)
        | null = null

      protected _channelCountMode = "explicit" as const
    },
  },
  stereoPanner: {
    cls: class StereoPannerNode
      extends AudioNode
      implements ClassTypes.NativeStereoPannerNode
    {
      get pan() {
        return this._pan
      }

      protected _pan = createMockAudioParam(this.context, {
        minValue: -1,
      })

      protected _channelCountMode = "clamped-max" as const

      protected _channelCount = 2
    },
  },
  waveShaper: {
    cls: class WaveShaperNode
      extends AudioNode
      implements ClassTypes.NativeWaveShaperNode
    {
      get curve() {
        return this._curve
      }

      get oversample() {
        return this._oversample
      }

      protected _curve: Float32Array | null = null

      protected _oversample: OverSampleType = "none"
    },
  },
}
