import { COMMON_SAMPLE_RATES } from "@/sampleRate"
import { removeGlobalProperty, setGlobalProperty } from "@/testing/util/globals"
import { AudioWorkletProcessor } from "./audioWorkletProcessor"
import { registerProcessor } from "./registerProcessor"

export const mockAudioWorkletGlobalScope = () => {
  setGlobalProperty("currentFrame", 0, globalThis)
  setGlobalProperty("currentTime", 0, globalThis)
  setGlobalProperty("sampleRate", COMMON_SAMPLE_RATES.standard, globalThis)
  setGlobalProperty("AudioWorkletProcessor", AudioWorkletProcessor, globalThis)
  setGlobalProperty("registerProcessor", registerProcessor, globalThis)
}

export const unMockAudioWorkletGlobalScope = () => {
  removeGlobalProperty("currentFrame", globalThis)
  removeGlobalProperty("currentTime", globalThis)
  removeGlobalProperty("sampleRate", globalThis)
  removeGlobalProperty("AudioWorkletProcessor", globalThis)
  removeGlobalProperty("registerProcessor", globalThis)
}
