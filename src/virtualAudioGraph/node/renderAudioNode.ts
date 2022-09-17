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
  destination?: VNode["node"] extends AudioNodeKeyName<"destination">
    ? undefined
    : RenderedAudioNode<VirtualAudioNode>
}

export const renderAudioNode = <VNode extends VirtualAudioNode>(
  vNode: VNode,
  context: AudioContext
): RenderedAudioNode<VNode> => ({
  virtualNode: vNode,
  audioNode: createAudioNode(vNode.node, context, vNode.options),
  inputs: vNode.inputs.map((input) => renderAudioNode(input, context)),
  destination: (vNode.destination
    ? renderAudioNode(vNode.destination, context)
    : undefined) as any,
})
