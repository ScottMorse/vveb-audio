import { VirtualAudioNode } from "../node"
import { NodeLookupMap } from "./lookupMap"

export class VirtualAudioGraphNode {
  get virtualNode() {
    return this._virtualNode
  }

  get inputs() {
    return this._inputs
  }

  get parents() {
    return this._parents
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  destroy() {
    this.inputs.forEach((input) => input.destroy())
    this.parents.forEach((parent) => parent.destroyInput(this.virtualNode.id))
    delete this.lookupMap[this.virtualNode.id]
    this._isDestroyed = true
    return this
  }

  constructor(
    virtualNode: VirtualAudioNode,
    lookupMap: NodeLookupMap,
    parents: VirtualAudioGraphNode[]
  ) {
    this._virtualNode = virtualNode

    this.lookupMap = lookupMap

    this._inputs = virtualNode.inputs.map((input) => this.resolveInput(input))

    lookupMap[virtualNode.id] = this

    this._parents = parents
  }

  protected addParent(parent: VirtualAudioGraphNode) {
    this._parents.push(parent)
  }

  protected destroyInput(nodeId: string) {
    this.inputs.splice(
      this.inputs.findIndex(({ virtualNode: { id } }) => id === nodeId),
      1
    )
  }

  private resolveInput(vNode: VirtualAudioNode) {
    const existing = this.lookupMap[vNode.id]
    if (existing) {
      if (existing.parents.find((parent) => parent === this)) {
        console.warn(
          `Node '${vNode.id}' is already an input of '${this.virtualNode.id}'`
        )
      } else {
        existing.addParent(this)
      }
      return existing
    } else {
      return new VirtualAudioGraphNode(vNode, this.lookupMap, [this])
    }
  }

  private _isDestroyed = false
  private _virtualNode: VirtualAudioNode
  private _inputs: VirtualAudioGraphNode[] = []
  private lookupMap: NodeLookupMap
  private _parents: VirtualAudioGraphNode[]
}
