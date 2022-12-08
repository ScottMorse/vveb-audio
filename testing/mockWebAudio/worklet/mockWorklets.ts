import { COMMON_SAMPLE_RATES } from "@/sampleRate"
import { removeGlobalProperty, setGlobalProperty } from "../../util/globals"
import { AudioWorklet } from "./audioWorklet"
import { MessagePort } from "./audioWorkletGlobalScope/messagePort"
import { registerProcessor } from "./audioWorkletGlobalScope/registerProcessor"
import { AudioWorkletProcessor } from "./audioWorkletProcessor"
import { Worklet } from "./worklet"

export const mockWindowWorklets = () => {
  setGlobalProperty("Worklet", Worklet)
  setGlobalProperty("AudioWorklet", AudioWorklet)
  setGlobalProperty("MessagePort", MessagePort)
  setGlobalProperty("AudioWorkletProcessor", AudioWorkletProcessor)
}

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
