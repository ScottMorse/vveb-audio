export const AUDIO_DESTINATION_NODES = {
  audio: {
    cls: AudioNode,
    nodeKind: "destination",
  },
  "audio-destination": {
    cls: AudioDestinationNode,
    nodeKind: "destination",
  },
  "media-stream-audio-destination": {
    cls: MediaStreamAudioDestinationNode,
    nodeKind: "destination",
  },
  analyser: {
    cls: AnalyserNode, // can also be an effect node (output is optional)
    nodeKind: "destination",
  },
} as const

export type AudioDestinationNodeKeyName = keyof typeof AUDIO_DESTINATION_NODES
export type AudioDestinationNodeConfig<
  K extends AudioDestinationNodeKeyName = AudioDestinationNodeKeyName
> = typeof AUDIO_DESTINATION_NODES[K]
