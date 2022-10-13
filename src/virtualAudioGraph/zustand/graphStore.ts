import { nanoid } from "nanoid"
import create from "zustand/vanilla"
import { AudioNodeKind, AudioNodeName } from "@/nativeWebAudio"
import {
  CreateVirtualAudioContextOptions,
  VirtualAudioContext,
  virtualAudioContextUtil,
} from "../context"
import {
  createVirtualAudioGraph,
  CreateVirtualAudioGraphOptions,
  VirtualAudioGraph,
} from "../graph"
import {
  CreateRootOptions,
  IsVirtualAudioNodeOptions,
  NarrowedVirtualAudioGraphNode,
  VirtualAudioNode,
  virtualAudioNodeUtil,
} from "../node"

interface VirtualGraphStore {
  graph: {
    id: string
    roots: VirtualAudioNode[]
    context: VirtualAudioContext
  }
  _lookupMap: Record<string, VirtualAudioNode>
}

export interface CreateGraphStoreOptions {
  autoRender?: boolean
  id?: string
  root: CreateRootOptions | CreateRootOptions[]
  context?: CreateVirtualAudioContextOptions
}

export const createGraphStore = (options: CreateGraphStoreOptions) => {
  const lookupMap: { [nodeId: string]: VirtualAudioNode } = {}

  const createNode = <IsRoot extends boolean = true>(
    nodeOrOptions: IsRoot extends true ? CreateRootOptions : VirtualAudioNode,
    isRoot: IsRoot = true as IsRoot
  ) => {
    let node: VirtualAudioNode
    if (isRoot) {
      node = virtualAudioNodeUtil.createRoot(nodeOrOptions)
      lookupMap[node.id] = node
      node.inputs.map((input) => createNode(input.node, false))
    } else {
      node = nodeOrOptions as VirtualAudioNode
      lookupMap[node.id] = node
    }
    return node
  }

  const roots = (
    Array.isArray(options.root) ? options.root : [options.root]
  ).map((root) => createNode(root))

  const { getState, setState, subscribe, destroy } = create<VirtualGraphStore>(
    (set) => ({
      graph: {
        id: options.id || nanoid(),
        roots,
        context: virtualAudioContextUtil.create(
          options.context || { kind: "main" }
        ),
      },
      _lookupMap: lookupMap,
    })
  )

  const getGraph = () => getState().graph

  const getNodes = <
    Name extends AudioNodeName = AudioNodeName,
    Kind extends AudioNodeKind = AudioNodeKind
  >(
    filter?: IsVirtualAudioNodeOptions<Name, Kind>
  ): NarrowedVirtualAudioGraphNode<Name, Kind>[] => {
    const nodes = Object.values(getState()._lookupMap)
    return filter
      ? nodes.filter((node) => virtualAudioNodeUtil.isNode(node, filter))
      : (nodes as any)
  }

  return {
    getGraph,
    getNodes,
    destroy,
    subscribe,
  }
}
