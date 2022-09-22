import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { resolveArrayArg } from "@/lib/util/array/resolveArrayArg"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  getAudioNodeConfig,
  isAudioNodeNameOfKind,
} from "@/nativeWebAudio"
import { ALL_AUDIO_NODES } from "@/nativeWebAudio/audioNode/audioNodes"
import { VNodeLookupMap, VNodePath } from "./internal/virtualAudioNode"
import {
  CreateVirtualAudioNodeRootOptions,
  VirtualAudioNode,
  VirtualAudioNodeOfKind,
} from "./virtualAudioNode"

interface CreateVirtualAudioNodeInternalOptions<Name extends AudioNodeName> {
  options: CreateVirtualAudioNodeRootOptions<Name>
  lookupMap: VNodeLookupMap
  path: VNodePath
  parentId: string | null
  rootId?: string
}

const _createVirtualAudioNode = <Name extends AudioNodeName>({
  options,
  lookupMap,
  path,
  parentId,
  rootId,
}: CreateVirtualAudioNodeInternalOptions<Name>): {
  node: VirtualAudioNode<Name>
  lookupMap: VNodeLookupMap
} => {
  const node: VirtualAudioNode<Name> = {
    id: nanoid(),
    name: options.name,
    options: (options?.options as any) || {},
    inputs: [],
  }

  const resolvedRootId = rootId || node.id

  if (options.inputs && !isAudioNodeNameOfKind(options.name, "source")) {
    ;(node.inputs as VirtualAudioNode[]) = options?.inputs?.map(
      (input, i) =>
        _createVirtualAudioNode({
          options: input,
          lookupMap,
          path: [...path, i],
          parentId: node.id,
          rootId: resolvedRootId,
        }).node
    )
  }

  lookupMap[node.id] = { node, path, parentId, rootId: resolvedRootId }
  return { node, lookupMap }
}

/** @todo doc and test */
const createRootVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateVirtualAudioNodeRootOptions<Name>
) =>
  _createVirtualAudioNode({
    options,
    lookupMap: {},
    parentId: null,
    path: [],
  })

/** Merges new options in deeply (arrays overwrite the existing value) */
const updateNodeOptions = <Node extends VirtualAudioNode>(
  node: Node,
  newOptions: DeeplyPartial<AudioNodeClassOptions<Node["name"]>>
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
 * @todo doc and test
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
  options: newOptions || newNodeType === node.name ? node.options : {},
})

/** @todo doc and test */
export const getNodeConfig = <Node extends VirtualAudioNode>(node: Node) =>
  getAudioNodeConfig(node.name)

/** @todo doc and test */
const isVirtualAudioNode = <
  Name extends AudioNodeName = AudioNodeName,
  Kind extends AudioNodeKind = AudioNodeKind
>(
  value: any,
  options?: {
    kind?: Kind | Kind[]
    name?: Name | Name[]
  }
): value is AudioNodeName extends Name
  ? VirtualAudioNodeOfKind<Kind>
  : VirtualAudioNode<Name> =>
  Array.isArray(value?.inputs) &&
  !!ALL_AUDIO_NODES[value?.name as AudioNodeName] &&
  value?.id &&
  isAudioNodeNameOfKind(value.name, ...resolveArrayArg(options?.kind || [])) &&
  options?.name
    ? resolveArrayArg(options.name).includes(value.name)
    : true

export const virtualAudioNodeUtil = {
  createRoot: createRootVirtualAudioNode,
  updateOptions: updateNodeOptions,
  updateType: updateNodeType,
  getConfig: getNodeConfig,
  isNode: isVirtualAudioNode,
}
