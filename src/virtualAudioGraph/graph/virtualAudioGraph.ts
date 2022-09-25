import { nanoid } from "nanoid"
import { AudioNodeKind, AudioNodeName } from "@/nativeWebAudio"
import {
  CreateVirtualAudioContextOptions,
  virtualAudioContextUtil,
} from "../context"
import {
  CreateRootOptions,
  IsVirtualAudioNodeOptions,
  virtualAudioNodeUtil,
} from "../node"
import {
  NodeLookupMap,
  resolveNodes,
  VirtualAudioGraphNodeArg,
} from "./lookupMap"
import { VirtualAudioGraphContext } from "./virtualAudioGraphContext"
import {
  VirtualAudioGraphNode,
  VirtualAudioGraphNodeOfKind,
} from "./virtualAudioGraphNode"

export class VirtualAudioGraph {
  get id() {
    return this._id
  }

  get roots() {
    return this._roots
  }

  get context() {
    return this._context
  }

  render() {
    if (this._context.canRender) {
      this._context.render()
      this.getNodes().forEach((node) => node?.render())
    } else {
      console.warn(
        `Cannot render virtual audio graph '${this.id}' until user has interacted with the page`
      )
    }
  }

  getNodes<
    Name extends AudioNodeName = AudioNodeName,
    Kind extends AudioNodeKind = AudioNodeKind
  >(filter?: IsVirtualAudioNodeOptions<Name, Kind>) {
    const nodes = Object.values(this.lookupMap)
    return filter
      ? nodes.filter((node) => virtualAudioNodeUtil.isNode(node, filter))
      : nodes
  }

  getNode(nodeId: string, warn = false) {
    const node = this.lookupMap[nodeId]
    if (warn && !node)
      console.warn(
        `Node ID '${nodeId}' in graph '${this.id}'`
      ) /** @todo verbosity-configurable logger */
    return node || null
  }

  deleteNode(nodeId: string, warn = false) {
    const node = this.getNode(nodeId, warn)
    if (node?.destroy() && this.roots.includes(node)) {
      this.deleteRoot(nodeId)
    }
  }

  constructor(
    roots: VirtualAudioGraphNodeArg[],
    context: CreateVirtualAudioContextOptions,
    id?: string
  ) {
    this._id = id || nanoid()
    this._context = new VirtualAudioGraphContext(
      virtualAudioContextUtil.create(context)
    )
    this._roots = resolveNodes(roots, this.lookupMap, this, this._context)
  }

  private deleteRoot(rootId: string) {
    this._roots.splice(
      this._roots.findIndex(({ id }) => id === rootId),
      1
    )
  }

  private _id: string
  private _roots: VirtualAudioGraphNode[] = []
  private _context: VirtualAudioGraphContext
  private lookupMap: NodeLookupMap = {}
}

export const createVirtualAudioGraph = (
  root: CreateRootOptions<AudioNodeName> | CreateRootOptions<AudioNodeName>[],
  context?: CreateVirtualAudioContextOptions,
  id?: string
) =>
  new VirtualAudioGraph(
    Array.isArray(root) ? root : [root],
    context || { name: "default" },
    id
  )
