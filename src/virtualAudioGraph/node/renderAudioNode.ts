import { AudioNodeInstance, createAudioNode } from "@/nativeWebAudio"
import { VirtualAudioNode } from "./virtualAudioNode/virtualAudioNode"

export interface RenderedAudioNode<VNode extends VirtualAudioNode> {
  virtualNode: VNode
  audioNode: AudioNodeInstance<VNode["name"]>
  inputs: RenderedAudioNode<VirtualAudioNode>[]
}

export const renderAudioNode = <VNode extends VirtualAudioNode>(
  vNode: VNode,
  context: AudioContext
): RenderedAudioNode<VNode> => {
  const audioNode = createAudioNode(
    vNode.name,
    context,
    vNode.options
  ) as AudioNodeInstance<VNode["name"]>

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
