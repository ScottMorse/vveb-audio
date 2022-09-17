export const AUDIO_SOURCE_NODES = {
  "audio-buffer-source": {
    cls: AudioBufferSourceNode,
    nodeKind: "source",
  },
  "audio-scheduled-source": {
    cls: AudioScheduledSourceNode,
    nodeKind: "source",
  },
  "constant-source": {
    cls: ConstantSourceNode,
    nodeKind: "source",
  },
  oscillator: {
    cls: OscillatorNode,
    nodeKind: "source",
  },
} as const
