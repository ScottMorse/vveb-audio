import {
  CreateVirtualAudioNodeRootOptions,
  VirtualAudioNode,
  virtualAudioNodeUtil,
} from "../node"
import { VNodeLookupMap } from "../node/virtualAudioNode/internal/virtualAudioNode"

class VirtualAudioGraphNode {
  constructor(private root: VirtualAudioNode) {}
}

export class VirtualAudioGraph {
  get roots() {
    return this._roots
  }

  constructor(roots: CreateVirtualAudioNodeRootOptions[]) {
    this._roots = roots.map((root) => {
      const { node, lookupMap } = virtualAudioNodeUtil.createRoot(root)
      this.lookupMaps[node.id] = lookupMap
      return new VirtualAudioGraphNode(node)
    })
  }

  private _roots: VirtualAudioGraphNode[]
  private lookupMaps: {
    [rootId: string]: VNodeLookupMap
  } = {}
}
