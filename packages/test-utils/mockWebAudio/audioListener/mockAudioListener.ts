import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { AudioListener } from "./mocks"

export const mockGlobalAudioListener = () => {
  setGlobalProperty("AudioListener", AudioListener)
}

export const unMockGlobalAudioListener = () => {
  removeGlobalProperty("AudioListener")
}
