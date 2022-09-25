export const ALL_AUDIO_CONTEXTS = {
  default: {
    cls: AudioContext,
  },
  offline: {
    cls: OfflineAudioContext,
  },
} as const
