export const CREATABLE_AUDIO_NODES = {
  analyser: {
    cls: AnalyserNode,
    constructorName: "AnalyserNode",
    contextMethod: "createAnalyser",
    kind: ["destination", "effect"], // provides 0 or 1 outputs
  },
  audioBufferSource: {
    cls: AudioBufferSourceNode,
    constructorName: "AudioBufferSourceNode",
    contextMethod: "createBufferSource",
    kind: ["source"],
  },
  audioScheduledSource: {
    cls: AudioScheduledSourceNode,
    constructorName: "AudioScheduledSourceNode",
    contextMethod: null,
    kind: ["source"],
  },
  biquadFilter: {
    cls: BiquadFilterNode,
    constructorName: "BiquadFilterNode",
    contextMethod: "createBiquadFilter",
    kind: ["effect"],
  },
  channelMerger: {
    cls: ChannelMergerNode,
    constructorName: "ChannelMergerNode",
    contextMethod: "createChannelMerger",
    kind: ["effect"],
  },
  channelSplitter: {
    cls: ChannelSplitterNode,
    constructorName: "ChannelSplitterNode",
    contextMethod: "createChannelSplitter",
    kind: ["effect"],
  },
  constantSource: {
    cls: ConstantSourceNode,
    constructorName: "ConstantSourceNode",
    contextMethod: "createConstantSource",
    kind: ["source"],
  },
  convolver: {
    cls: ConvolverNode,
    constructorName: "ConvolverNode",
    contextMethod: "createConvolver",
    kind: ["effect"],
  },
  dynamicsCompressor: {
    cls: DynamicsCompressorNode,
    constructorName: "DynamicsCompressorNode",
    contextMethod: "createDynamicsCompressor",
    kind: ["effect"],
  },
  delay: {
    cls: DelayNode,
    constructorName: "DelayNode",
    contextMethod: "createDelay",
    kind: ["effect"],
  },
  gain: {
    cls: GainNode,
    constructorName: "GainNode",
    contextMethod: "createGain",
    kind: ["effect"],
  },
  iirFilter: {
    cls: IIRFilterNode,
    constructorName: "IIRFilterNode",
    contextMethod: "createIIRFilter",
    kind: ["effect"],
  },
  mediaElementAudioSource: {
    cls: MediaElementAudioSourceNode,
    constructorName: "MediaElementAudioSourceNode",
    contextMethod: "createMediaElementSource",
    kind: ["source"],
  },
  mediaStreamAudioDestination: {
    cls: MediaStreamAudioDestinationNode,
    constructorName: "MediaStreamAudioDestinationNode",
    contextMethod: "createMediaStreamDestination",
    kind: ["destination"],
  },
  mediaStreamAudioSource: {
    cls: MediaStreamAudioSourceNode,
    constructorName: "MediaStreamAudioSourceNode",
    contextMethod: "createMediaStreamSource",
    kind: ["source"],
  },
  oscillator: {
    cls: OscillatorNode,
    constructorName: "OscillatorNode",
    contextMethod: "createOscillator",
    kind: ["source"],
  },
  panner: {
    cls: PannerNode,
    constructorName: "PannerNode",
    contextMethod: "createPanner",
    kind: ["effect"],
  },
  scriptProcessor: {
    cls: ScriptProcessorNode,
    constructorName: "ScriptProcessorNode",
    contextMethod: "createScriptProcessor",
    kind: ["effect"],
  },
  stereoPanner: {
    cls: StereoPannerNode,
    constructorName: "StereoPannerNode",
    contextMethod: "createStereoPanner",
    kind: ["effect"],
  },
  waveShaper: {
    cls: WaveShaperNode,
    constructorName: "WaveShaperNode",
    contextMethod: "createWaveShaper",
    kind: ["effect"],
  },
} as const

export const ALL_AUDIO_NODES = {
  ...CREATABLE_AUDIO_NODES,
  audio: {
    cls: AudioNode,
    constructorName: "AudioNode",
    contextMethod: null,
    kind: ["destination", "effect"],
  },
  audioDestination: {
    cls: AudioDestinationNode,
    constructorName: "AudioDestinationNode",
    contextMethod: null,
    kind: ["destination"],
  },
} as const
