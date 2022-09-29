import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { logger } from "@/lib/logger"
import { resolveArrayArg } from "@/lib/util/array/resolveArrayArg"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
  AudioParamName,
  getAudioNodeConfig,
  isAudioNodeNameOfKind,
} from "@/nativeWebAudio"
import { ALL_AUDIO_NODES } from "@/nativeWebAudio/audioNode/audioNodes"
import { virtualAudioParamUtil } from "../audioParam"
import {
  CreateVirtualAudioNodeInput,
  CreateVirtualAudioNodeOptions,
  CreateVirtualAudioNodeOptionsOrReference,
  VirtualAudioNode,
  VirtualAudioNodeInput,
  VirtualAudioNodeOfKind,
  VirtualAudioNodeReference,
} from "./virtualAudioNode"

type OrphanedReference = VirtualAudioNodeReference & {
  parentId: string
  param?: AudioParamName
}

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

  if (options.id && idMap[options.id]) {
    logger.warn(
      `Node with id ${options.id} already exists in the graph and will not be recreated. You can use { idRef: "${options.id}" } to reference it instead.`
    )
    return idMap[options.id] as any
  }

  const node: VirtualAudioNode<Name> = {
    id: options.id || nanoid(),
    name: options.name,
    options: (options?.options as any) || {},
    inputs: [] as Name extends AudioNodeNameOfKind<"source">
      ? []
      : VirtualAudioNodeInput<Name, false>[],
    params: {} as VirtualAudioNode<Name>["params"],
  }

  const resolvedRootId = rootId || node.id

  if (options.inputs && !isAudioNodeNameOfKind(node.name, "source")) {
    node.inputs =
      (options?.inputs?.map((input) => {
        if (virtualAudioNodeUtil.isReference(input.node)) {
          orphanedReferences.push({
            ...input.node,
            parentId: node.id,
          })
          return input
        }
        return {
          node: createVirtualAudioNode({
            options: input.node as any,
            rootId: resolvedRootId,
            idMap,
            orphanedReferences,
          }),
          param: input.param,
        }
      }) as any) || []
  }

  if (options.params) {
    node.params = Object.entries(options.params).reduce<typeof node.params>(
      (params, [paramName, paramOptions]) => {
        params[paramName as AudioParamName<Name>] =
          virtualAudioParamUtil.create(paramOptions as any)
        return params
      },
      node.params
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
    if (nodeKind[0] === "source" && nodeKind.length === 1) {
      /** @todo maybe should be configurable on AudioNodeName basis with more AudioNodeConfig metadata about input/output constraints */
      logger.warn(
        `A source node cannot have an input (node ID ref: '${node.id}')`
      )
      parent.inputs.splice(parentInputIndex, 1)
    } else {
      parent.inputs.splice(parentInputIndex, 1, {
        node: node as VirtualAudioNodeOfKind<"source" | "effect">,
        param: ref.param,
      })
    }

    orphanedReferences.splice(index, 1)
  }

  if (node.id === resolvedRootId) {
    for (const nodeId of orphanedReferences) {
      logger.warn(`Node idRef '${nodeId}' was not found in the graph`)
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

type CreateDefaultDestinationOptions<
  AllowReferenceInput extends boolean = false
> = { defaultDestination: true } & Pick<
  CreateVirtualAudioNodeOptions<"audio-destination", AllowReferenceInput>,
  "inputs"
>

const createDefaultDestinationNode = (
  inputs?: CreateVirtualAudioNodeInput<AudioNodeName, true>[]
): VirtualAudioNode<"audio-destination"> =>
  createVirtualAudioNode({
    options: {
      ...DEFAULT_DESTINATION_NODE,
      inputs,
    },
  })

export type CreateRootOptions<Name extends AudioNodeName = AudioNodeName> =
  | CreateDefaultDestinationOptions<true>
  | (CreateVirtualAudioNodeOptionsOrReference<Name> & {
      defaultDestination?: never
    })

export const isDefaultDestinationOptions = (
  options: CreateRootOptions<AudioNodeName>
): options is CreateDefaultDestinationOptions<true> =>
  !!(options as CreateDefaultDestinationOptions).defaultDestination

/** @todo doc and test */
const createRootVirtualAudioNode = <Name extends AudioNodeName>(
  options: CreateRootOptions<Name>
): typeof options extends CreateDefaultDestinationOptions
  ? VirtualAudioNode<"audio-destination">
  : VirtualAudioNode<Name> =>
  isDefaultDestinationOptions(options)
    ? createDefaultDestinationNode(options.inputs)
    : (createVirtualAudioNode<CreateVirtualAudioNodeOptionsOrReference<Name>>(
        isVirtualAudioNodeReference(options)
          ? { options }
          : {
              options: {
                ...options,
                inputs: (getAudioNodeConfig(options.name).kind.includes(
                  "source"
                )
                  ? (() => {
                      logger.warn("Source nodes should not have inputs")
                      return []
                    })()
                  : options.inputs) as any,
              },
            }
      ) as any)

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

export interface IsVirtualAudioNodeOptions<
  Name extends AudioNodeName = AudioNodeName,
  Kind extends AudioNodeKind = AudioNodeKind
> {
  kind?: Kind | Kind[]
  name?: Name | Name[]
}

/** Resolve node type by given generics. Useful when filtering a list of nodes by a set of names and/or kinds */
export type NarrowedVirtualAudioNode<
  Name extends AudioNodeName = AudioNodeName,
  Kind extends AudioNodeKind = AudioNodeKind
> = AudioNodeName extends Name
  ? VirtualAudioNodeOfKind<Kind>
  : VirtualAudioNode<Name>

/** @todo doc and test */
const isVirtualAudioNode = <
  Name extends AudioNodeName = AudioNodeName,
  Kind extends AudioNodeKind = AudioNodeKind
>(
  value: any,
  options?: IsVirtualAudioNodeOptions<Name, Kind>
): value is NarrowedVirtualAudioNode<Name, Kind> =>
  Array.isArray(value?.inputs) &&
  !!ALL_AUDIO_NODES[value?.name as AudioNodeName] &&
  value?.id &&
  isAudioNodeNameOfKind(value.name, ...resolveArrayArg(options?.kind || [])) &&
  (options?.name ? resolveArrayArg(options.name).includes(value.name) : true)

export const virtualAudioNodeUtil = {
  createRoot: createRootVirtualAudioNode,
  updateOptions: updateNodeOptions,
  updateType: updateNodeType,
  getConfig: getNodeConfig,
  isNode: isVirtualAudioNode,
  isReference: isVirtualAudioNodeReference,
}
