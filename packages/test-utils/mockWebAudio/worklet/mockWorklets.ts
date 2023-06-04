import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { AudioWorkletProcessor } from "./audioWorkletGlobalScope"
import { MessagePort } from "./audioWorkletGlobalScope/mocks/MessagePort"
import { AudioWorklet, Worklet } from "./mocks"

export const mockGlobalWorklets = () => {
  setGlobalProperty("Worklet", Worklet)
  setGlobalProperty("AudioWorklet", AudioWorklet)
  setGlobalProperty("MessagePort", MessagePort)
  setGlobalProperty("AudioWorkletProcessor", AudioWorkletProcessor)
}

export const unMockGlobalWorklets = () => {
  removeGlobalProperty(
    "Worklet",
    "AudioWorklet",
    "MessagePort",
    "AudioWorkletProcessor"
  )
}
