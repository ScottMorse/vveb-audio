import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKeyName,
  AudioNodeKind,
  DefaultAudioNodeKindFromKeyName,
  getAudioNodeConfig,
} from "@/nativeWebAudio"
import { VNodeLookupMap, VNodePath } from "./internal/virtualAudioNode"

/** An interface representing an AudioNode abstractly */
export interface VirtualAudioNode<
  NodeKeyName extends AudioNodeKeyName<NodeKind> = any,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
> {
  id: string
  node: NodeKeyName
  options: AudioNodeClassOptions<NodeKeyName, NodeKind>
  inputs: VirtualAudioNode<AudioNodeKeyName<"effect" | "source">>[]
}

export type VirtualAudioNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioNode<AudioNodeKeyName<Kind>>

export interface CreateVirtualAudioNodeRootOptions<
  NodeKeyName extends AudioNodeKeyName<NodeKind> = any,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
> {
  /** Reference to a specific AudioNode class */
  node: NodeKeyName
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<NodeKeyName>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: NodeKeyName extends AudioNodeKeyName<"effect" | "destination">
    ? CreateVirtualAudioNodeRootOptions<AudioNodeKeyName<"effect" | "source">>[]
    : undefined
}

const _createVirtualAudioNode = <
  NodeKeyName extends AudioNodeKeyName<NodeKind>,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
>(
  options: CreateVirtualAudioNodeRootOptions<NodeKeyName, NodeKind>,
  lookupMap: VNodeLookupMap,
  path: VNodePath
): { node: VirtualAudioNode<NodeKeyName>; lookupMap: VNodeLookupMap } => {
  const node: VirtualAudioNode<NodeKeyName> = {
    id: nanoid(),
    node: options.node,
    options: (options?.options as any) || {},
    inputs: [],
  }

  if (options.inputs) {
    node.inputs = options?.inputs?.map(
      (input, i) => _createVirtualAudioNode(input, lookupMap, [...path, i]).node
    )
  }

  lookupMap[node.id] = { node, path }
  return { node, lookupMap }
}

const createRootVirtualAudioNode = <
  NodeKeyName extends AudioNodeKeyName<NodeKind>,
  NodeKind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<NodeKeyName>
>(
  options: CreateVirtualAudioNodeRootOptions<NodeKeyName>
) => _createVirtualAudioNode(options, {}, [])

/** Merges new options in deeply (arrays overwrite the existing value) */
const updateNodeOptions = <Node extends VirtualAudioNode>(
  node: Node,
  newOptions: DeeplyPartial<AudioNodeClassOptions<Node["node"]>>
) => ({
  ...node,
  options: mergeWith({}, node.options, newOptions, (_objValue, srcValue) => {
    if (Array.isArray(srcValue)) {
      return srcValue
    }
  }),
})

/**
 * Note that this will override previous options if
 * the new options aren't supplied, unless the node
 * type is not a change.
 */
const updateNodeType = <
  Node extends VirtualAudioNode,
  NewNodeKeyName extends AudioNodeKeyName
>(
  node: Node,
  newNodeType: NewNodeKeyName,
  newOptions?: AudioNodeClassOptions<NewNodeKeyName, any>
) => ({
  ...node,
  node: newNodeType,
  options: newOptions || newNodeType === node.node ? node.options : {},
})

const getNodeConfig = <Node extends VirtualAudioNode>(node: Node) =>
  getAudioNodeConfig(node.node)

const isSourceNode = (
  node: VirtualAudioNode
): node is VirtualAudioNode<AudioNodeKeyName<"source">> =>
  !!getAudioNodeConfig(node.node as any, "source")

const isDestinationNode = (
  node: VirtualAudioNode
): node is VirtualAudioNode<AudioNodeKeyName<"destination">> =>
  !!getAudioNodeConfig(node.node as any, "destination")

const isEffectNode = (
  node: VirtualAudioNode
): node is VirtualAudioNode<AudioNodeKeyName<"effect">> =>
  !!getAudioNodeConfig(node.node as any, "effect")

export const VirtualAudioNodeUtil = {
  createRoot: createRootVirtualAudioNode,
  updateOptions: updateNodeOptions,
  updateType: updateNodeType,
  getConfig: getNodeConfig,
  isSource: isSourceNode,
  isDestination: isDestinationNode,
  isEffect: isEffectNode,
}
