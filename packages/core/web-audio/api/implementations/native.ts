import { ValidatedTypeMapping } from "@@core/internal/util/types"
import { AbstractWebAudio } from "./apiInterface"

const NATIVE_API = {
  AudioContext: globalThis.AudioContext,
  OfflineAudioContext: globalThis.OfflineAudioContext,
  AudioNode: globalThis.AudioNode,
  AudioParam: globalThis.AudioParam,
  AudioDestinationNode: globalThis.AudioDestinationNode,
  AudioListener: globalThis.AudioListener,
  AudioBuffer: globalThis.AudioBuffer,
  AudioBufferSourceNode: globalThis.AudioBufferSourceNode,
  AudioScheduledSourceNode: globalThis.AudioScheduledSourceNode,
  OscillatorNode: globalThis.OscillatorNode,
  GainNode: globalThis.GainNode,
  DelayNode: globalThis.DelayNode,
  BiquadFilterNode: globalThis.BiquadFilterNode,
  IIRFilterNode: globalThis.IIRFilterNode,
  WaveShaperNode: globalThis.WaveShaperNode,
  PannerNode: globalThis.PannerNode,
  StereoPannerNode: globalThis.StereoPannerNode,
  ConvolverNode: globalThis.ConvolverNode,
  ChannelSplitterNode: globalThis.ChannelSplitterNode,
  ChannelMergerNode: globalThis.ChannelMergerNode,
  DynamicsCompressorNode: globalThis.DynamicsCompressorNode,
  AnalyserNode: globalThis.AnalyserNode,
  ScriptProcessorNode: globalThis.ScriptProcessorNode,
  AudioProcessingEvent: globalThis.AudioProcessingEvent,
  BaseAudioContext: globalThis.BaseAudioContext,
  AudioWorkletNode: globalThis.AudioWorkletNode,
  AudioWorklet: globalThis.AudioWorklet,
  ConstantSourceNode: globalThis.ConstantSourceNode,
  MediaElementAudioSourceNode: globalThis.MediaElementAudioSourceNode,
  MediaStreamAudioSourceNode: globalThis.MediaStreamAudioSourceNode,
  MediaStreamAudioDestinationNode: globalThis.MediaStreamAudioDestinationNode,
  PeriodicWave: globalThis.PeriodicWave,
} as const

export const createNativeWebAudioApi = () => ({
  ...(NATIVE_API as ValidatedTypeMapping<typeof NATIVE_API, AbstractWebAudio>),
})
