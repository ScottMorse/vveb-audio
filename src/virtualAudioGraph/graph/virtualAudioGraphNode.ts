import { VirtualAudioNode } from "../node"
import { NodeLookupMap } from "./lookupMap"

export type ParentRelation = "input" | "destination"

export type VirtualAudioGraphNodeParent<
  Relation extends ParentRelation = ParentRelation
> = {
  node: VirtualAudioGraphNode
  relation: Relation
} & (Relation extends "input" ? { index: number } : object)

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

  get destination() {
    return this._destination
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  destroy() {
    this.inputs.forEach((input) => input.destroy())
    this.destination?.destroy()
    this.parents?.forEach((parent) =>
      parent.node.destroyChild(this.virtualNode.id)
    )
    delete this._lookupMap[this.virtualNode.id]
    this._isDestroyed = true
    return this
  }

  constructor(
    virtualNode: VirtualAudioNode,
    lookupMap: NodeLookupMap,
    parents: VirtualAudioGraphNodeParent[]
  ) {
    this._virtualNode = virtualNode

    this._inputs = virtualNode.inputs.map((input, i) =>
      this.resolveChild(input, { node: this, relation: "input", index: i })
    )

    lookupMap[virtualNode.id] = this

    this._lookupMap = lookupMap
    this._parents = parents
    this._destination = virtualNode.destination
      ? this.resolveChild(virtualNode.destination, {
          node: this,
          relation: "destination",
        })
      : null
  }

  protected addParent(parent: VirtualAudioGraphNodeParent) {
    this._parents.push(parent)
  }

  protected destroyChild<Relation extends ParentRelation>(
    nodeId: string,
    relation: Relation,
    ...[index]: Relation extends "input" ? [number] : []
  ) {
    if (relation === "destination") {
      delete this.virtualNode.destination
      this._destination = null
    } else {
      this.inputs.splice(
        this.inputs.findIndex(({ virtualNode: { id } }) => id === nodeId),
        1
      )
    }
  }

  private resolveChild<Relation extends ParentRelation>(
    vNode: VirtualAudioNode,
    parentage: VirtualAudioGraphNodeParent<Relation>
  ) {
    const existing = this._lookupMap[vNode.id]
    if (existing) {
      if (parentage.relation === "destination" && existing.destination) {
        console.warn(`Node '${vNode.id}' already has a destination. `)
      }
      existing.addParent(parentage)
      return existing
    } else {
      return new VirtualAudioGraphNode(vNode, this._lookupMap, [parentage])
    }
  }

  private _isDestroyed = false
  private _virtualNode: VirtualAudioNode
  private _inputs: VirtualAudioGraphNode[] = []
  private _destination: VirtualAudioGraphNode | null
  private _lookupMap: NodeLookupMap
  private _parents: VirtualAudioGraphNodeParent[]
}
