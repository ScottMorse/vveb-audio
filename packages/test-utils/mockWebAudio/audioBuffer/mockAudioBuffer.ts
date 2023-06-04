import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { AudioBuffer } from "./mocks/AudioBuffer"

export const mockGlobalAudioBuffer = () => {
  setGlobalProperty("AudioBuffer", AudioBuffer)
}

export const unMockGlobalAudioBuffer = () => {
  removeGlobalProperty("AudioBuffer")
}
