export * from "./AudioNode"
export * from "./AudioDestinationNode"
export * from "./subclasses"

import { MOCK_AUDIO_NODE_SUBCLASSES } from "./subclasses"

// re-export all subclasses
export const {
  analyser: { cls: AnalyserNode },
  audioBufferSource: { cls: AudioBufferSourceNode },
  audioScheduledSource: { cls: AudioScheduledSourceNode },
  biquadFilter: { cls: BiquadFilterNode },
  channelMerger: { cls: ChannelMergerNode },
  channelSplitter: { cls: ChannelSplitterNode },
  constantSource: { cls: ConstantSourceNode },
  convolver: { cls: ConvolverNode },
  delay: { cls: DelayNode },
  dynamicsCompressor: { cls: DynamicsCompressorNode },
  gain: { cls: GainNode },
  iirFilter: { cls: IIRFilterNode },
  mediaElementAudioSource: { cls: MediaElementAudioSourceNode },
  mediaStreamAudioSource: { cls: MediaStreamAudioSourceNode },
  mediaStreamAudioDestination: { cls: MediaStreamAudioDestinationNode },
  oscillator: { cls: OscillatorNode },
  panner: { cls: PannerNode },
  scriptProcessor: { cls: ScriptProcessorNode },
  stereoPanner: { cls: StereoPannerNode },
  waveShaper: { cls: WaveShaperNode },
} = MOCK_AUDIO_NODE_SUBCLASSES
