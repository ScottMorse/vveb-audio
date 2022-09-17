export const AUDIO_EFFECT_NODES = {
  audio: {
    cls: AudioNode,
    nodeKind: "effect",
  },
  analyser: {
    cls: AnalyserNode, // can also be a destination node (can optionally output)
    nodeKind: "effect",
  },
  "biquad-filter": {
    cls: BiquadFilterNode,
    nodeKind: "effect",
  },
  "channel-merger": {
    cls: ChannelMergerNode,
    nodeKind: "effect",
  },
  "channel-splitter": {
    cls: ChannelSplitterNode,
    nodeKind: "effect",
  },
  convolver: {
    cls: ConvolverNode,
    nodeKind: "effect",
  },
  delay: {
    cls: DelayNode,
    nodeKind: "effect",
  },
  "dynamics-compressor": {
    cls: DynamicsCompressorNode,
    nodeKind: "effect",
  },
  gain: {
    cls: GainNode,
    nodeKind: "effect",
  },
  "iir-filter": {
    cls: IIRFilterNode,
    nodeKind: "effect",
  },
  panner: {
    cls: PannerNode,
    nodeKind: "effect",
  },
} as const

export type AudioEffectNodeKeyName = keyof typeof AUDIO_EFFECT_NODES
export type AudioEffectNodeConfig<
  K extends AudioEffectNodeKeyName = AudioEffectNodeKeyName
> = typeof AUDIO_EFFECT_NODES[K]
