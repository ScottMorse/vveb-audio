import { nanoid } from "nanoid"
import {
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "@/nativeWebAudio"
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
import { VirtualAudioGraphNode } from "./virtualAudioGraphNode"
import { VirtualAudioContext } from "../context"

export class VirtualAudioGraph {
  get id() {
    return this._id
  }

  get roots() {
    return this._roots
  }

  getSources() {
    return this.getNodes().filter((node) =>
      virtualAudioNodeUtil.isNode(node, { kind: "source" })
    )
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

  constructor(roots: VirtualAudioGraphNodeArg[], context: VirtualAudioContext) {
    this._roots = resolveNodes(roots, this.lookupMap, this)
    this
  }

  private deleteRoot(rootId: string) {
    this._roots.splice(
      this._roots.findIndex(({ id }) => id === rootId),
      1
    )
  }

  private _id = nanoid()
  private _roots: VirtualAudioGraphNode[] = []
  private lookupMap: NodeLookupMap = {}
}

export const createVirtualAudioGraph = (
  root: CreateRootOptions<AudioNodeName> | CreateRootOptions<AudioNodeName>[]
) => new VirtualAudioGraph(Array.isArray(root) ? root : [root])
