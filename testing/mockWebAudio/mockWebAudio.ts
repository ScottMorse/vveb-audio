import { mockWindowAudioContext } from "./context"
import { mockWindowAudioNodes } from "./node"

export const mockWebAudio = () => {
  mockWindowAudioContext()
  mockWindowAudioNodes()
}
