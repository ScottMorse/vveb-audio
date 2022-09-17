import {
  AudioNodeKeyName,
  AudioNodeKind,
  ALL_AUDIO_NODES,
  AUDIO_NODES_BY_KIND,
  AudioNodeConfig,
  DefaultAudioNodeKindFromKeyName,
  AudioNodeClass,
  AudioNodeClassOptions,
} from "./audioNode"

export type DefaultAbleAudioNodeKind = AudioNodeKind | "default"

export type ResolveAudioNodeKind<NodeKind extends DefaultAbleAudioNodeKind> =
  NodeKind extends "default" ? AudioNodeKind : NodeKind

/**
 * Lookup data about an AudioNode by its key name.
 * This gives you access to the class itself, as well as
 * the node kind (source, effect, or destination).
 *
 * Some nodes belong to two kinds, such as effect and destination,
 * so a specific kind can be specified.
 *
 * If no node kind is specified or "default" is given for a node
 * with more than one kind, an arbitrary default kind is used. Otherwise,
 * the default kind will be the only node kind defined for the node.
 */
export const getAudioNodeConfig = <
  K extends AudioNodeKeyName<ResolveAudioNodeKind<OpNodeKind>>,
  OpNodeKind extends DefaultAbleAudioNodeKind = "default"
>(
  key: K,
  nodeKind: OpNodeKind = "default" as OpNodeKind
): AudioNodeConfig<K, ResolveAudioNodeKind<OpNodeKind>> =>
  nodeKind === "default"
    ? (ALL_AUDIO_NODES as any)[key]
    : AUDIO_NODES_BY_KIND[nodeKind as AudioNodeKind][
        key as keyof typeof AUDIO_NODES_BY_KIND[AudioNodeKind]
      ] || (ALL_AUDIO_NODES as any)[key]

export const createAudioNode = <
  K extends AudioNodeKeyName<Kind>,
  Kind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<K>
>(
  key: K,
  ctx: AudioContext,
  options?: AudioNodeClassOptions<K, Kind>
): InstanceType<AudioNodeClass<K, Kind>> => {
  return new (getAudioNodeConfig(key).cls)(ctx, options as any) as any
}
