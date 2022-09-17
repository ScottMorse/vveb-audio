import { produce } from "immer"
import { TypedEventEmitter } from "@/lib/util/events"
import {
  AudioNodeClassOptions,
  AudioNodeKeyName,
  AudioNodeKind,
  DefaultAudioNodeKindFromKeyName,
} from "@/nativeWebAudio"
import {
  CreateVirtualAudioNodeRootOptions,
  VirtualAudioNode,
  VirtualAudioNodeUtil,
} from "../node"
import {
  getVNodeByPath,
  VNodeLookupMap,
  VNodePath,
} from "../node/internal/virtualAudioNode"

export interface VirtualAudioGraphEvents {
  root: VirtualAudioNode
  deleteNodes: string[]
  addInput: { id: string; input: VirtualAudioNode }
  updateOptions: { id: string; options: AudioNodeClassOptions<any> }
  updateDestination: { id: string; destination: VirtualAudioNode }
}

const deleteDestination = (node: VirtualAudioNode, id: string) => {
  if (!node.destination) {
    console.error(`Node '${id}' is not destination of parent`, {
      node,
    })
    return null
  }
  const dest = node.destination

  node.destination = undefined
  delete node.destination

  return dest
}

const deleteInput = (node: VirtualAudioNode, index: number, id: string) => {
  if (index >= node.inputs.length) {
    console.error(`Node '${id}' has no input at index ${index}`, { node })
    return null
  }

  const input = node.inputs[index]

  node.inputs.splice(index, 1)

  return input
}

export class VirtualAudioGraph extends TypedEventEmitter<VirtualAudioGraphEvents> {
  public get root() {
    return this._root
  }

  constructor(root: CreateVirtualAudioNodeRootOptions) {
    super()

    const { node, lookupMap } = VirtualAudioNodeUtil.createRoot(root)
    this._root = node
    this.lookupMap = lookupMap
  }

  /**
   * For the generic type, pass the key name representing the
   * audio class that you are expect to update the options for
   * (same as `node` name option used when first constructing the
   * `VirtualAudioGraph`)
   *
   * ```@example
   * const graph = new VirtualAudioGraph({
   *  node: 'gain',
   * })
   *
   *
   * ```
   */
  updateNodeOptions<
    KeyName extends AudioNodeKeyName<Kind>,
    Kind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<KeyName>
  >(nodeId: string, options: AudioNodeClassOptions<KeyName, Kind>) {
    this.updateRoot((root) => {
      const path = this.getNodePath(nodeId)
      if (path === null) return

      const node = this.getNodeByPathAtRoot(root, path, nodeId)
      if (!node) return

      node.options = VirtualAudioNodeUtil.updateOptions(node, options).options

      this.emit("updateOptions", { id: nodeId, options: node.options })
    })
  }

  addInput(
    nodeId: string,
    input: CreateVirtualAudioNodeRootOptions<
      AudioNodeKeyName<"effect" | "source">
    >
  ) {
    this.updateRoot((root) => {
      const path = this.getNodePath(nodeId)
      if (path === null) return

      const parent = this.getNodeByPathAtRoot(root, path, nodeId)
      if (!parent) return

      const { node, lookupMap } = VirtualAudioNodeUtil.createRoot(input)
      Object.assign(this.lookupMap, lookupMap)
      parent.inputs.push(node)

      this.emit("addInput", { id: nodeId, input: node })
    })
  }

  setDestination(
    nodeId: string,
    destination: CreateVirtualAudioNodeRootOptions<
      AudioNodeKeyName<"effect" | "destination">
    >
  ) {
    this.updateRoot((root) => {
      const path = this.getNodePath(nodeId)
      if (path === null) return

      const parent = this.getNodeByPathAtRoot(root, path, nodeId)
      if (!parent) return

      if (parent.destination) {
        this.deleteNode(parent.destination.id)
      }

      const { node, lookupMap } = VirtualAudioNodeUtil.createRoot(destination)
      Object.assign(this.lookupMap, lookupMap)

      parent.destination = node

      this.emit("updateDestination", { id: nodeId, destination: node })
    })
  }

  deleteNode(nodeId: string) {
    this.updateRoot((root) => {
      const path = this.getNodePath(nodeId, true)
      if (path === null) return

      const parent = this.getNodeByPathAtRoot(root, path.slice(0, -1), nodeId)
      if (!parent) return

      let deleted: VirtualAudioNode | null = null
      const [lastPath] = path.slice(-1)
      if (lastPath === "D") {
        deleted = deleteDestination(parent, nodeId)
      } else if (lastPath[0] === "I") {
        deleted = deleteInput(parent, parseInt(lastPath.slice(1)), nodeId)
      } else {
        console.error(`Unsupported path '${path}' for node '${nodeId}'`)
      }
      if (deleted) this.deleteLookups(deleted)
    })
  }

  getNode(nodeId: string) {
    return this.lookupMap[nodeId]?.node ?? null
  }

  private deleteLookups(
    node: VirtualAudioNode,
    _first = true,
    _idsDeleted: string[] = []
  ) {
    if (this.lookupMap[node.id]) {
      delete this.lookupMap[node.id]
      _idsDeleted.push(node.id)
    }
    if (node.destination)
      this.deleteLookups(node.destination, false, _idsDeleted)

    node.inputs.forEach((input) =>
      this.deleteLookups(input, false, _idsDeleted)
    )

    if (_first) this.emit("deleteNodes", _idsDeleted)
    return _idsDeleted
  }

  private getNodeByPathAtRoot(
    root: VirtualAudioNode,
    path: VNodePath,
    id: string
  ) {
    const node = getVNodeByPath(root, path)
    if (!node) {
      console.warn(`Node '${id}' not found at path`, { path })
    }
    return node
  }

  private getNodePath(nodeId: string, disallowRoot = false) {
    let path = this.lookupMap[nodeId]?.path ?? null
    if (path === null) {
      console.warn(`Node with id '${nodeId}' not found`)
    }
    if ((disallowRoot && path?.length === 0) || nodeId === this.root.id) {
      console.error(
        `This operation is not allowed on the root node '${nodeId}'`
      )
      path = null
    }
    return path
  }

  private updateRoot(mutateDraft: (draft: VirtualAudioNode) => void) {
    this._root = produce(this._root, mutateDraft)
    this.emit("root", this._root)
  }

  private lookupMap: VNodeLookupMap<true>
  private _root: VirtualAudioNode
}

export const createVirtualAudioGraph = (
  root: CreateVirtualAudioNodeRootOptions
) => new VirtualAudioGraph(root)
