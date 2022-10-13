export const ALL_AUDIO_CONTEXTS = {
  normal: {
    cls: AudioContext,
  },
  offline: {
    cls: OfflineAudioContext,
  },
} as const
