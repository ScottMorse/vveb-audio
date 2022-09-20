export const ALL_AUDIO_NODES = {
  "audio-buffer-source": {
    cls: AudioBufferSourceNode,
    kind: ["source"],
  },
  "audio-scheduled-source": {
    cls: AudioScheduledSourceNode,
    kind: ["source"],
  },
  "constant-source": {
    cls: ConstantSourceNode,
    kind: ["source"],
  },
  oscillator: {
    cls: OscillatorNode,
    kind: ["source"],
  },
  "audio-destination": {
    cls: AudioDestinationNode,
    kind: ["destination"],
  },
  "media-stream-audio-destination": {
    cls: MediaStreamAudioDestinationNode,
    kind: ["destination"],
  },
  analyser: {
    cls: AnalyserNode,
    kind: ["destination", "effect"], // provides 0 or 1 outputs
  },

  "biquad-filter": {
    cls: BiquadFilterNode,
    kind: ["effect"],
  },
  "channel-merger": {
    cls: ChannelMergerNode,
    kind: ["effect"],
  },
  "channel-splitter": {
    cls: ChannelSplitterNode,
    kind: ["effect"],
  },
  convolver: {
    cls: ConvolverNode,
    kind: ["effect"],
  },
  delay: {
    cls: DelayNode,
    kind: ["effect"],
  },
  "dynamics-compressor": {
    cls: DynamicsCompressorNode,
    kind: ["effect"],
  },
  gain: {
    cls: GainNode,
    kind: ["effect"],
  },
  "iir-filter": {
    cls: IIRFilterNode,
    kind: ["effect"],
  },
  panner: {
    cls: PannerNode,
    kind: ["effect"],
  },
} as const
