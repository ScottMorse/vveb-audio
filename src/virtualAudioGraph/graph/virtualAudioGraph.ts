import { nanoid } from "nanoid"
import { AudioNodeName } from "@/nativeWebAudio"
import {
  CreateVirtualAudioNodeOptions,
  VirtualAudioNode,
  virtualAudioNodeUtil,
} from "../node"
import { NodeLookupMap } from "./lookupMap"
import { VirtualAudioGraphNode } from "./virtualAudioGraphNode"

export class VirtualAudioGraph {
  get id() {
    return this._id
  }

  get roots() {
    return this._roots
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
    if (node?.destroy() && !node.parents.length) {
      this.deleteRoot(nodeId)
    }
  }

  constructor(roots: CreateVirtualAudioNodeOptions<AudioNodeName, true>[]) {
    this._roots = roots.map((root) => {
      const { node } = virtualAudioNodeUtil.createRoot(root)
      this.rawRoots.push(node)
      return new VirtualAudioGraphNode(node, this.lookupMap, [])
    })
  }

  private deleteRoot(rootId: string) {
    const index = this._roots.findIndex(
      ({ virtualNode: { id } }) => id === rootId
    )
    this._roots.splice(index, 1)
    this.rawRoots.splice(index, 1)
  }

  private _id = nanoid()
  private _roots: VirtualAudioGraphNode[]
  private rawRoots: VirtualAudioNode<AudioNodeName, true>[] = []
  private lookupMap: NodeLookupMap = {}
}

export const createVirtualAudioGraph = (
  root:
    | CreateVirtualAudioNodeOptions<AudioNodeName, true>
    | CreateVirtualAudioNodeOptions<AudioNodeName, true>[]
) => new VirtualAudioGraph(Array.isArray(root) ? root : [root])
