import { mockWindowAudioContext } from "./context"
import { mockWindowAudioNodes } from "./node"
import { mockWorklet } from "./worklet"

export const mockWebAudio = () => {
  mockWorklet()
  mockWindowAudioContext()
  mockWindowAudioNodes()
}
