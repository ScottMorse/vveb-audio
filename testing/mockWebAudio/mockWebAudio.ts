import { mockWindowAudioContext } from "./audioContext"
import { mockWindowAudioNodes } from "./audioNode"
import { mockWindowWorklets } from "./worklet"

export const mockWebAudio = () => {
  mockWindowWorklets()
  mockWindowAudioContext()
  mockWindowAudioNodes()
}
