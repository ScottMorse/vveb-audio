import { setGlobalProperty } from "../../util/globals"
import { AudioContext } from "./audioContext"
import { BaseAudioContext } from "./baseAudioContext"
import { OfflineAudioContext } from "./offlineAudioContext"

export const mockWindowAudioContext = () => {
  setGlobalProperty("AudioContext", AudioContext)
  setGlobalProperty("OfflineAudioContext", OfflineAudioContext)
  setGlobalProperty("BaseAudioContext", BaseAudioContext)
}
