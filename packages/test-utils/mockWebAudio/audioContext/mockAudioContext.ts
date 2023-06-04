import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { AudioContext } from "./mocks/AudioContext"
import { BaseAudioContext } from "./mocks/BaseAudioContext"
import { OfflineAudioContext } from "./mocks/OfflineAudioContext"

export const mockGlobalAudioContext = () => {
  setGlobalProperty("AudioContext", AudioContext)
  setGlobalProperty("OfflineAudioContext", OfflineAudioContext)
  setGlobalProperty("BaseAudioContext", BaseAudioContext)
}

export const unMockGlobalAudioContext = () => {
  removeGlobalProperty(
    "AudioContext",
    "OfflineAudioContext",
    "BaseAudioContext"
  )
}
