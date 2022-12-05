import { nanoid } from "nanoid"
import { immer } from "zustand/middleware/immer"
import create from "zustand/vanilla"
import { logger } from "@/lib/logger"
import { AnyFunction } from "@/lib/util/types"
import { AudioNodeKind, AudioNodeName } from "@/nativeWebAudio"
import {
  CreateVirtualAudioContextOptions,
  VirtualAudioContext,
  virtualAudioContextUtil,
} from "../context"
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
}

interface InternalStore extends VirtualGraphStore {
  lookupMap: { [nodeId: string]: VirtualAudioNode }
}

type StoreSelector<T = any> = (state: InternalStore) => T

export interface CreateGraphStoreOptions {
  autoRender?: boolean
  id?: string
  root: CreateRootOptions | CreateRootOptions[]
  context?: CreateVirtualAudioContextOptions
}

export const createGraphStore = (options: CreateGraphStoreOptions) => {
  const lookupMap: InternalStore["lookupMap"] = {}

  const createNode = <IsRoot extends boolean = true>(
    nodeOrOptions: IsRoot extends true ? CreateRootOptions : VirtualAudioNode,
    isRoot: IsRoot = true as IsRoot
  ) => {
    const node = isRoot
      ? virtualAudioNodeUtil.createRoot(nodeOrOptions)
      : (nodeOrOptions as VirtualAudioNode)
    node.inputs.map((input) => createNode(input.node, false))
    lookupMap[node.id] = node
    return node
  }

  const roots = (
    Array.isArray(options.root) ? options.root : [options.root]
  ).map((root) => createNode(root))

  const { getState, setState, subscribe, destroy } = create<InternalStore>()(
    immer<InternalStore>((set) => ({
      graph: {
        id: options.id || nanoid(),
        roots,
        context: virtualAudioContextUtil.create(
          options.context || { kind: "main" }
        ),
      },
      lookupMap,
    }))
  )

  const selectGraph = (state: VirtualGraphStore) => state.graph

  const selectNodes =
    (state: InternalStore) =>
    <
      Name extends AudioNodeName = AudioNodeName,
      Kind extends AudioNodeKind = AudioNodeKind
    >(
      filter?: IsVirtualAudioNodeOptions<Name, Kind>
    ): NarrowedVirtualAudioGraphNode<Name, Kind>[] => {
      const nodes = Object.values(state.lookupMap)
      return filter
        ? nodes.filter((node) => virtualAudioNodeUtil.isNode(node, filter))
        : (nodes as any)
    }

  const selectNode =
    (state: InternalStore) =>
    (id: string, warn = false) => {
      const node = state.lookupMap[id]
      if (warn && !node) {
        logger.warn(`Node ID '${id}' in graph '${state.graph.id}' not found`)
      }
      return node || null
    }

  const createGetter =
    <F extends StoreSelector>(func: F) =>
    (): ReturnType<F> =>
      func(getState())

  const forwardState =
    <F extends StoreSelector<AnyFunction>>(
      func: F
    ): ((...args: Parameters<ReturnType<F>>) => ReturnType<ReturnType<F>>) =>
    (...args) =>
      func(getState())(...args)

  return {
    getGraph: createGetter(selectGraph),
    getNodes: forwardState(selectNodes),
    getNode: forwardState(selectNode),
    destroy,
    subscribe,
  }
}
