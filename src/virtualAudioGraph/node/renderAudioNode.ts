import { AudioNodeInstance, createAudioNode } from "@/nativeWebAudio"
import { VirtualAudioNode } from "./virtualAudioNode"

export interface RenderedAudioNode<VNode extends VirtualAudioNode> {
  virtualNode: VNode
  audioNode: AudioNodeInstance<VNode["node"]>
  inputs: RenderedAudioNode<VirtualAudioNode>[]
}

export const renderAudioNode = <VNode extends VirtualAudioNode>(
  vNode: VNode,
  context: AudioContext
): RenderedAudioNode<VNode> => {
  const audioNode = createAudioNode(
    vNode.node,
    context,
    vNode.options
  ) as AudioNodeInstance<VNode["node"]>

  return {
    virtualNode: vNode,
    audioNode,
    inputs: vNode.inputs.map((input) => {
      const renderedInput = renderAudioNode(input, context)
      renderedInput.audioNode.connect(audioNode)
      return renderedInput
    }),
  }
}
