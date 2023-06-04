import { ConstructorNameToString } from "../../internal/util/decorators"
import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { MOCK_AUDIO_NODE_SUBCLASSES, AudioNode } from "./mocks"

export const mockGlobalAudioNodes = () => {
  setGlobalProperty("AudioNode", AudioNode)
  for (const { cls } of Object.values(MOCK_AUDIO_NODE_SUBCLASSES)) {
    setGlobalProperty(cls.name, ConstructorNameToString(cls))
  }
}

export const unMockGlobalAudioNodes = () => {
  removeGlobalProperty(
    "AudioNode",
    ...Object.values(MOCK_AUDIO_NODE_SUBCLASSES).map(({ cls }) => cls.name)
  )
}
