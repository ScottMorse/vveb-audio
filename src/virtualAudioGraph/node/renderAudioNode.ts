import {
  AudioNodeKeyName,
  AudioNodeConfig,
  createAudioNode,
} from "@/nativeWebAudio"
import { VirtualAudioNode } from "./virtualAudioNode"

export interface RenderedAudioNode<VNode extends VirtualAudioNode> {
  virtualNode: VNode
  audioNode: InstanceType<AudioNodeConfig<VNode["node"]>["cls"]>
  inputs: RenderedAudioNode<VirtualAudioNode>[]
}

export const renderAudioNode = <VNode extends VirtualAudioNode>(
  vNode: VNode,
  context: AudioContext
): RenderedAudioNode<VNode> => {
  const audioNode = createAudioNode(vNode.node, context, vNode.options)
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
