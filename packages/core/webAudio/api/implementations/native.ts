import { ValidatedTypeMapping } from "@@core/internal/util/types"
import { AbstractWebAudioImpl } from "./apiInterface"

const _createNativeWebAudioApi = () => ({
  name: "native" as const,
  api: {
    AudioBuffer: globalThis.AudioBuffer,
    AudioBufferSourceNode: globalThis.AudioBufferSourceNode,
    AudioContext: globalThis.AudioContext,
    AudioDestinationNode: globalThis.AudioDestinationNode,
    AudioScheduledSourceNode: globalThis.AudioScheduledSourceNode,
    AudioListener: globalThis.AudioListener,
    AudioNode: globalThis.AudioNode,
    AudioParam: globalThis.AudioParam,
    AudioProcessingEvent: globalThis.AudioProcessingEvent,
    AudioWorklet: globalThis.AudioWorklet,
    AudioWorkletNode: globalThis.AudioWorkletNode,
    AnalyserNode: globalThis.AnalyserNode,
    BaseAudioContext: globalThis.BaseAudioContext,
    BiquadFilterNode: globalThis.BiquadFilterNode,
    ChannelMergerNode: globalThis.ChannelMergerNode,
    ChannelSplitterNode: globalThis.ChannelSplitterNode,
    ConstantSourceNode: globalThis.ConstantSourceNode,
    ConvolverNode: globalThis.ConvolverNode,
    DelayNode: globalThis.DelayNode,
    DynamicsCompressorNode: globalThis.DynamicsCompressorNode,
    GainNode: globalThis.GainNode,
    IIRFilterNode: globalThis.IIRFilterNode,
    MediaElementAudioSourceNode: globalThis.MediaElementAudioSourceNode,
    MediaStreamAudioDestinationNode: globalThis.MediaStreamAudioDestinationNode,
    MediaStreamAudioSourceNode: globalThis.MediaStreamAudioSourceNode,
    OfflineAudioContext: globalThis.OfflineAudioContext,
    OscillatorNode: globalThis.OscillatorNode,
    PannerNode: globalThis.PannerNode,
    PeriodicWave: globalThis.PeriodicWave,
    StereoPannerNode: globalThis.StereoPannerNode,
    WaveShaperNode: globalThis.WaveShaperNode,
  },
})

export const createNativeWebAudioApi = () =>
  _createNativeWebAudioApi() as ValidatedTypeMapping<
    ReturnType<typeof _createNativeWebAudioApi>,
    AbstractWebAudioImpl
  >
