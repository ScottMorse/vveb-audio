import { setGlobalProperty } from "../../util/globals"
import { AudioNode } from "./audioNode"
import { AUDIO_NODE_KEYS } from "./audioNodes"

export const mockWindowAudioNodes = () => {
  setGlobalProperty("AudioNode", AudioNode)

  for (const node of AUDIO_NODE_KEYS) {
    setGlobalProperty(node, class extends AudioNode {})
  }
}
