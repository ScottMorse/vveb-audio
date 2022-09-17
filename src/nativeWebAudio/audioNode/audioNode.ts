import { AUDIO_DESTINATION_NODES } from "./nodeKinds/destinationNode"
import { AUDIO_EFFECT_NODES } from "./nodeKinds/effectNode"
import { AUDIO_SOURCE_NODES } from "./nodeKinds/sourceNode"

export const ALL_AUDIO_NODES = {
  ...AUDIO_SOURCE_NODES,
  ...AUDIO_DESTINATION_NODES,
  ...AUDIO_EFFECT_NODES,
} as const

export const AUDIO_NODES_BY_KIND = {
  source: AUDIO_SOURCE_NODES,
  effect: AUDIO_EFFECT_NODES,
  destination: AUDIO_DESTINATION_NODES,
} as const

export type AudioNodeKind = keyof typeof AUDIO_NODES_BY_KIND

type AudioNodeKeyNameByKind<NodeKind extends AudioNodeKind = AudioNodeKind> =
  NodeKind extends "effect"
    ? keyof typeof AUDIO_EFFECT_NODES
    : NodeKind extends "source"
    ? keyof typeof AUDIO_SOURCE_NODES
    : NodeKind extends "destination"
    ? keyof typeof AUDIO_DESTINATION_NODES
    : keyof typeof ALL_AUDIO_NODES

export type AudioNodeKeyName<NodeKind extends AudioNodeKind = AudioNodeKind> =
  AudioNodeKeyNameByKind<NodeKind>

export type DefaultAudioNodeKindFromKeyName<
  NodeKeyName extends AudioNodeKeyName
> = typeof ALL_AUDIO_NODES[NodeKeyName]["nodeKind"]

export type AudioNodeConfig<
  NodeKeyName extends AudioNodeKeyNameByKind<NodeKind>,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
> = typeof ALL_AUDIO_NODES[NodeKeyName] & {
  nodeKind: NodeKind
}

export type AudioNodeClass<
  NodeKeyName extends AudioNodeKeyName<NodeKind>,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
> = AudioNodeConfig<NodeKeyName, NodeKind>["cls"]

export type AudioNodeClassOptions<
  NodeKeyName extends AudioNodeKeyName<NodeKind>,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
> = ConstructorParameters<AudioNodeClass<NodeKeyName, NodeKind>> extends []
  ? undefined
  : ConstructorParameters<AudioNodeClass<NodeKeyName, NodeKind>>[1]
