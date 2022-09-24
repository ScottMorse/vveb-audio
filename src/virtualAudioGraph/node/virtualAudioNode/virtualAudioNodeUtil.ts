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
import {
  CreateVirtualAudioNodeInput,
  CreateVirtualAudioNodeOptions,
  CreateVirtualAudioNodeOptionsOrReference,
  VirtualAudioNode,
  VirtualAudioNodeOfKind,
  VirtualAudioNodeReference,
} from "./virtualAudioNode"

type OrphanedReference = VirtualAudioNodeReference & { parentId: string }

interface CreateVirtualAudioNodeInternalOptions<
  Name extends AudioNodeName,
  Options extends CreateVirtualAudioNodeOptionsOrReference<Name>
> {
  options: Options
  rootId?: string
  parentId?: string
  idMap?: Record<string, VirtualAudioNode | VirtualAudioNodeReference>
  orphanedReferences?: OrphanedReference[]
}

const isVirtualAudioNodeReference = (
  options: any
): options is VirtualAudioNodeReference => typeof options?.idRef === "string"

/** @todo i need to be broken up and refactored */
const createVirtualAudioNode = <
  Options extends CreateVirtualAudioNodeOptionsOrReference<Name>,
  Name extends AudioNodeName = AudioNodeName
>({
  options,
  rootId,
  parentId = "",
  idMap = {},
  orphanedReferences = [],
}: CreateVirtualAudioNodeInternalOptions<
  Name,
  Options
>): Options extends VirtualAudioNodeReference
  ? VirtualAudioNode<Name> | VirtualAudioNodeReference
  : VirtualAudioNode<Name> => {
  if (isVirtualAudioNodeReference(options)) {
    const node = idMap[options.idRef]
    if (!node) {
      orphanedReferences.push({
        ...options,
        parentId: parentId || (rootId as string),
      })
      return options as any
    }
    return node as any
  }

  const node: VirtualAudioNode<Name> = {
    id: options.id || nanoid(),
    name: options.name,
    options: (options?.options as any) || {},
    inputs: [],
  }

  const resolvedRootId = rootId || node.id

  if (options.inputs && !isAudioNodeNameOfKind(options.name, "source")) {
    ;(node.inputs as any[]) = options?.inputs?.map((input) =>
      createVirtualAudioNode({
        options: input,
        rootId: resolvedRootId,
        idMap,
        orphanedReferences,
      })
    )
  }

  idMap[node.id] = node

  const canHydrateReference = () => {
    if (!options.id) return false // only should reference manually ID'd nodes since relies on references created before the graph is constructed
    const index = orphanedReferences.findIndex(({ idRef }) => idRef === node.id)
    if (index > -1) {
      const orphan = orphanedReferences[index]
      const parent = idMap[orphan.parentId]
      return isVirtualAudioNode(parent)
    }
    return false
  }

  while (canHydrateReference()) {
    const index = orphanedReferences.findIndex(({ idRef }) => idRef === node.id)
    const ref = orphanedReferences[index]

    const parent = idMap[ref.parentId] as VirtualAudioNodeOfKind<
      "destination" | "effect"
    > // canHydrateReference confirms the parent is not a reference
    const parentInputIndex = parent.inputs.findIndex(
      (input) => (input as any as VirtualAudioNodeReference).idRef === ref.idRef
    )

    const nodeKind = getAudioNodeConfig(node.name).kind
    if (nodeKind.length === 1 && nodeKind[0] === "source") {
      /** @todo maybe should be configurable on AudioNodeName basis with more AudioNodeConfig metadata about input/output constraints */
      console.warn(
        `A source node cannot have an input (node ID ref: '${node.id}')`
      )
      parent.inputs.splice(parentInputIndex, 1)
    } else {
      parent.inputs.splice(
        parentInputIndex,
        1,
        node as VirtualAudioNodeOfKind<"source" | "effect">
      )
    }

    orphanedReferences.splice(index, 1)
  }

  if (node.id === resolvedRootId) {
    for (const nodeId of orphanedReferences) {
      console.warn(`Node idRef '${nodeId}' was not found in the graph`)
    }
  }

  return node
}

export const DEFAULT_DESTINATION_ID = "default-destination"

const DEFAULT_DESTINATION_NODE = {
  id: DEFAULT_DESTINATION_ID,
  name: "audio-destination",
  options: undefined,
} as const

type CreateDefaultDestinationOptions = { defaultDestination: true } & Pick<
  CreateVirtualAudioNodeOptions<"audio-destination">,
  "inputs"
>

const createDefaultDestinationNode = (
  inputs?: CreateVirtualAudioNodeInput[]
): VirtualAudioNode<"audio-destination"> =>
  createVirtualAudioNode({
    options: {
      ...DEFAULT_DESTINATION_NODE,
      inputs:
        inputs?.map((input) =>
          createVirtualAudioNode({
            options: input,
            rootId: DEFAULT_DESTINATION_ID,
          })
        ) || [],
    },
  })

export type CreateRootOptions<Name extends AudioNodeName = AudioNodeName> =
  | CreateDefaultDestinationOptions
  | (CreateVirtualAudioNodeOptions<Name> & {
      defaultDestination?: never
    })

const isDefaultDestination = (
  options: CreateRootOptions<AudioNodeName>
): options is CreateDefaultDestinationOptions =>
  !!(options as CreateDefaultDestinationOptions).defaultDestination

/** @todo doc and test */
const createRootVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateRootOptions<Name>
): typeof options extends CreateDefaultDestinationOptions
  ? VirtualAudioNode<"audio-destination">
  : VirtualAudioNode<Name> =>
  isDefaultDestination(options)
    ? createDefaultDestinationNode(options.inputs)
    : (createVirtualAudioNode({
        options: {
          ...options,
          inputs: (getAudioNodeConfig(options.name).kind.includes("source")
            ? (() => {
                console.warn("Source nodes should not have inputs")
                return []
              })()
            : options.inputs) as any,
        },
      }) as any)

/** Simply a pass through to check type of input more strongly */
export const createVirtualAudioInput = <Name extends AudioNodeName>(
  inputOptions: CreateVirtualAudioNodeOptions<Name>
) => inputOptions

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
