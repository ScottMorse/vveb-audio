import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../../internal/util/globals"

export interface MockAudioWorkletScopeOptions {
  /** Default 48,000 (48KHz) */
  sampleRate?: number
}

export const mockAudioWorkletGlobalScope = (
  options?: MockAudioWorkletScopeOptions
) => {
  setGlobalProperty("currentFrame", 0)
  setGlobalProperty("currentTime", 0)
  setGlobalProperty("sampleRate", options?.sampleRate ?? 48_000)
  setGlobalProperty("AudioWorkletProcessor", AudioWorkletProcessor)
  setGlobalProperty("registerProcessor", registerProcessor)
}

export const unMockGlobalAudioWorkletGlobalScope = () => {
  removeGlobalProperty(
    "currentFrame",
    "currentTime",
    "sampleRate",
    "registerProcessor",
    "AudioWorkletProcessor"
  )
}
