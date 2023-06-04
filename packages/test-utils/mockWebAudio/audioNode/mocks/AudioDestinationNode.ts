import { ConstructorNameToString } from "../../../internal/util/decorators"
import { NativeAudioDestinationNode } from "../../../internal/util/nativeTypes"
import { BaseAudioContext } from "../../audioContext"
import { AudioNode } from "./AudioNode"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

@ConstructorNameToString
export class AudioDestinationNode
  extends AudioNode
  implements NativeAudioDestinationNode
{
  constructor(context: BaseAudioContext, _allow: typeof ALLOW_CONSTRUCTOR) {
    super(context)
    if (_allow !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
  }

  get channelCount() {
    return 2
  }

  get maxChannelCount() {
    return 4
  }

  get numberOfInputs() {
    return 1
  }

  get numberOfOutputs() {
    return 0
  }

  protected _channelCountMode: ChannelCountMode = "explicit"

  protected _channelInterpretation: ChannelInterpretation = "speakers"
}

export const createMockAudioDestinationNode = (context: BaseAudioContext) => {
  return new AudioDestinationNode(context, ALLOW_CONSTRUCTOR)
}
