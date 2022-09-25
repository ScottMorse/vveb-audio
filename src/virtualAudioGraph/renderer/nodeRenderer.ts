import {
  AudioNodeInstance,
  AudioNodeName,
  createAudioNode,
} from "@/nativeWebAudio"
import { VirtualAudioGraphNode } from "../graph"
import { VirtualAudioGraphContext } from "../graph/virtualAudioGraphContext"
import { DEFAULT_DESTINATION_ID } from "../node"

export class NodeRenderer<Name extends AudioNodeName> {
  get audioNode() {
    return this._audioNode
  }

  render() {
    if (this.context.audioContext) {
      const audioNode =
        this.virtualNode.id === DEFAULT_DESTINATION_ID
          ? this.context.audioContext.destination
          : createAudioNode(
              this.virtualNode.name,
              this.context.audioContext,
              this.virtualNode.options
            )

      this.virtualNode.inputs.forEach((node) => {
        if (!node.audioNode) {
          node.render()
        }
        node.audioNode?.connect(audioNode)
      })

      this._audioNode = audioNode as any
    } else {
      console.warn(
        `Cannot render node '${this.virtualNode.id}' because the context has not been rendered`
      )
    }
    return this._audioNode
  }

  constructor(
    private virtualNode: VirtualAudioGraphNode<Name>,
    private context: VirtualAudioGraphContext
  ) {}

  private _audioNode: AudioNodeInstance<Name> | null = null
}
