import { AUDIO_BUFFER_TESTS } from "./audioBufferTests"
import { AUDIO_CONTEXT_TESTS } from "./audioContextTests"
import { AUDIO_LISTENER_TESTS } from "./audioListenerTests"
import { MEDIA_STREAM_TESTS } from "./mediaStreamTests"
import { OFFLINE_AUDIO_CONTEXT_TESTS } from "./offlineAudioContextTests"
import { PERIODIC_WAVE_TESTS } from "./periodicWaveTests"

export const TESTS = {
  MediaStream: MEDIA_STREAM_TESTS,
  "BaseAudioContext + AudioContext": AUDIO_CONTEXT_TESTS,
  OfflineAudioContext: OFFLINE_AUDIO_CONTEXT_TESTS,
  AudioListener: AUDIO_LISTENER_TESTS,
  AudioBuffer: AUDIO_BUFFER_TESTS,
  PeriodicWave: PERIODIC_WAVE_TESTS,
} as const
