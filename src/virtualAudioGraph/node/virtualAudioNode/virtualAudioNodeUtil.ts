import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { resolveArrayArg } from "@/lib/util/array/resolveArrayArg"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
  getAudioNodeConfig,
  isAudioNodeNameOfKind,
} from "@/nativeWebAudio"
import { ALL_AUDIO_NODES } from "@/nativeWebAudio/audioNode/audioNodes"
import {
  CreateVirtualAudioNodeRootOptions,
  VirtualAudioNode,
  VirtualAudioNodeOfKind,
} from "./virtualAudioNode"

interface CreateVirtualAudioNodeInternalOptions<
  Name extends AudioNodeName,
  IsRoot extends boolean = true
> {
  options: CreateVirtualAudioNodeRootOptions<Name, IsRoot>
  rootId?: string
}

const _createVirtualAudioNode = <Name extends AudioNodeName>({
  options,
  rootId,
}: CreateVirtualAudioNodeInternalOptions<Name, boolean>): {
  node: VirtualAudioNode<Name>
  destination: VirtualAudioNodeOfKind<"destination">
} => {
  const destination = (
    options.destination
      ? _createVirtualAudioNode({ options: options.destination as any, rootId })
          .node
      : undefined
  ) as any

  const node: VirtualAudioNode<Name> = {
    id: nanoid(),
    name: options.name,
    isRoot: !rootId,
    options: (options?.options as any) || {},
    inputs: [],
    destination,
  }

  const resolvedRootId = rootId || node.id

  if (options.inputs && !isAudioNodeNameOfKind(options.name, "source")) {
    ;(node.inputs as VirtualAudioNode[]) = options?.inputs?.map(
      (input) =>
        _createVirtualAudioNode({
          options: input,
          rootId: resolvedRootId,
        }).node
    )
  }

  return { node, destination }
}

/** @todo doc and test */
const createRootVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateVirtualAudioNodeRootOptions<Name>
) =>
  _createVirtualAudioNode({
    options,
  }) as {
    node: VirtualAudioNode<Name, true>
    destination?: VirtualAudioNodeOfKind<"destination", false>
  }

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
