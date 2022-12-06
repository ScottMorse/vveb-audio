import { setGlobalProperty } from "../../util/globals"
import {
  AudioContext,
  BaseAudioContext,
  OfflineAudioContext,
} from "./mockAudioContext"

export const mockWindowAudioContext = () => {
  setGlobalProperty("AudioContext", AudioContext)
  setGlobalProperty("OfflineAudioContext", OfflineAudioContext)
  setGlobalProperty("BaseAudioContext", BaseAudioContext)
}
