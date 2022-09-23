import { VirtualAudioNode } from "../node"
import { NodeLookupMap } from "./lookupMap"

export class VirtualAudioGraphNode {
  get virtualNode() {
    return this._virtualNode
  }

  get inputs() {
    return this._inputs
  }

  get parent() {
    return this._parent
  }

  get destination() {
    return this._destination
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  destroy() {
    delete this._lookupMap[this.virtualNode.id]
    this.inputs.forEach((input) => input.destroy())
    this.destination?.destroy()
    this.parent?.destroyChild(this.virtualNode.id)
    this._isDestroyed = true
    return this
  }

  constructor(
    virtualNode: VirtualAudioNode,
    lookupMap: NodeLookupMap,
    parent?: VirtualAudioGraphNode
  ) {
    this._virtualNode = virtualNode

    this._inputs = virtualNode.inputs.map(
      (input) => new VirtualAudioGraphNode(input, lookupMap, this)
    )

    lookupMap[virtualNode.id] = this

    this._lookupMap = lookupMap
    this._parent = parent || null
    this._destination = virtualNode.destination
      ? new VirtualAudioGraphNode(virtualNode.destination, lookupMap, this)
      : null
  }

  protected destroyChild(nodeId: string) {
    if (this.virtualNode.destination?.id === nodeId) {
      delete this.virtualNode.destination
      this._destination = null
    } else {
      this.inputs.splice(
        this.inputs.findIndex(({ virtualNode: { id } }) => id === nodeId),
        1
      )
    }
  }

  private _isDestroyed = false
  private _virtualNode: VirtualAudioNode
  private _inputs: VirtualAudioGraphNode[] = []
  private _destination: VirtualAudioGraphNode | null
  private _lookupMap: NodeLookupMap
  private _parent: VirtualAudioGraphNode | null
}
