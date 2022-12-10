import { COMMON_SAMPLE_RATES } from "@/sampleRate"
import { removeGlobalProperty, setGlobalProperty } from "../../util/globals"
import { AudioWorklet } from "./audioWorklet"
import { MessagePort } from "./audioWorkletGlobalScope/messagePort"
import { registerProcessor } from "./audioWorkletGlobalScope/registerProcessor"
import { Worklet } from "./worklet"

export const mockWindowWorklets = () => {
  setGlobalProperty("Worklet", Worklet)
  setGlobalProperty("AudioWorklet", AudioWorklet)
}
