import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameByKind,
  getAudioNodeConfig,
  isAudioNodeNameOfKind,
} from "@/nativeWebAudio"
import { VNodeLookupMap, VNodePath } from "./internal/virtualAudioNode"

/** An interface representing an AudioNode abstractly */
export interface VirtualAudioNode<Name extends AudioNodeName = AudioNodeName> {
  id: string
  node: Name
  options: AudioNodeClassOptions<Name>
  inputs: Name extends AudioNodeNameByKind<"source">
    ? []
    : VirtualAudioNode<AudioNodeNameByKind<"effect" | "source">>[]
}

export type VirtualAudioNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioNode<AudioNodeNameByKind<Kind>>

export interface CreateVirtualAudioNodeRootOptions<
  Name extends AudioNodeName = any
> {
  /** Reference to a specific AudioNode class */
  node: Name
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<Name>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: Name extends AudioNodeNameByKind<"effect" | "destination">
    ? CreateVirtualAudioNodeRootOptions<
        AudioNodeNameByKind<"effect" | "source">
      >[]
    : undefined
}

const _createVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateVirtualAudioNodeRootOptions<Name>,
  lookupMap: VNodeLookupMap,
  path: VNodePath
): { node: VirtualAudioNode<Name>; lookupMap: VNodeLookupMap } => {
  const node: VirtualAudioNode<Name> = {
    id: nanoid(),
    node: options.node,
    options: (options?.options as any) || {},
    inputs: [],
  }

  if (options.inputs && !isAudioNodeNameOfKind(options.node, "source")) {
    ;(node.inputs as VirtualAudioNode[]) = options?.inputs?.map(
      (input, i) => _createVirtualAudioNode(input, lookupMap, [...path, i]).node
    )
  }

  lookupMap[node.id] = { node, path }
  return { node, lookupMap }
}

const createRootVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateVirtualAudioNodeRootOptions<Name>
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
  NewName extends AudioNodeName
>(
  node: Node,
  newNodeType: NewName,
  newOptions?: AudioNodeClassOptions<NewName>
) => ({
  ...node,
  node: newNodeType,
  options: newOptions || newNodeType === node.node ? node.options : {},
})

const getNodeConfig = <Node extends VirtualAudioNode>(node: Node) =>
  getAudioNodeConfig(node.node)

const isNodeKind = <Kind extends AudioNodeKind>(
  node: VirtualAudioNode,
  ...kind: Kind[]
): node is VirtualAudioNodeOfKind<Kind> =>
  isAudioNodeNameOfKind(node.node, ...kind)

export const virtualAudioNodeUtil = {
  createRoot: createRootVirtualAudioNode,
  updateOptions: updateNodeOptions,
  updateType: updateNodeType,
  getConfig: getNodeConfig,
  isKind: isNodeKind,
}
