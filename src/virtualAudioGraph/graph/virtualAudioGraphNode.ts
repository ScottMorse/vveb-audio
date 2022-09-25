import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
  getAudioNodeConfig,
} from "@/nativeWebAudio"
import {
  CreateVirtualAudioNodeOptionsOrReference,
  VirtualAudioNode,
  VirtualAudioNodeOfKind,
  virtualAudioNodeUtil,
} from "../node"
import { NodeLookupMap, resolveNodes } from "./lookupMap"
/** WARNING: This is a circular dependency, but only used as a type, so it is tolerated */
import { VirtualAudioGraph } from "./virtualAudioGraph"

export type VirtualAudioGraphNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioGraphNode<AudioNodeNameOfKind<Kind>>

export type AddInputOptions<Name extends AudioNodeName> =
  | CreateVirtualAudioNodeOptionsOrReference<Name>
  | VirtualAudioGraphNode<Name>

export class VirtualAudioGraphNode<Name extends AudioNodeName = AudioNodeName> {
  get id() {
    return this._id
  }

  get name(): Name {
    return this._name
  }

  get options() {
    return this._options
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

  updateOptions(options: DeeplyPartial<AudioNodeClassOptions<Name>>) {
    const newOptions = virtualAudioNodeUtil.updateOptions(
      this._virtualNode,
      options
    ).options
    this._virtualNode.options = newOptions
    this._options = newOptions
  }

  /**
   * Update the type of node.
   * If the name is different from the current name
   * and new options are not provided, the node's options
   * are defaulted, overriding the current options.
   */
  updateNodeName<NewName extends AudioNodeName>(
    name: NewName,
    newOptions?: AudioNodeClassOptions<NewName>
  ) {
    const newVirtualNode = virtualAudioNodeUtil.updateType(
      this._virtualNode,
      name,
      newOptions
    )
    Object.assign(this._virtualNode, newVirtualNode)
    this._name = newVirtualNode.name
    this._options = newVirtualNode.options
  }

  addInput<Name extends AudioNodeNameOfKind<"effect" | "source">>(
    ...inputs: AddInputOptions<Name>[]
  ) {
    const newInputs = resolveNodes(inputs, this.lookupMap, this.graph)
    for (const input of newInputs) {
      const { kind } = getAudioNodeConfig(input.name)
      if (kind.length === 1 && kind[0] === "destination") {
        console.warn(
          `Cannot add destination node '${input.id}' as input to node '${this.id}' in graph ${this.graph.id}`
        )
      } else {
        this._inputs.push(
          input as VirtualAudioGraphNodeOfKind<"effect" | "source">
        )
      }
    }
  }

  destroy() {
    this.inputs.forEach((input) => input.destroy())
    this.parents.forEach((parent) => parent.destroyInput(this.id))
    delete this.lookupMap[this.id]
    this._isDestroyed = true
    return this
  }

  constructor(
    virtualNode: VirtualAudioNode<Name>,
    lookupMap: NodeLookupMap,
    parents: VirtualAudioGraphNode[],
    graph: VirtualAudioGraph
  ) {
    this._virtualNode = virtualNode
    this._id = virtualNode.id
    this._name = virtualNode.name
    this._options = virtualNode.options

    this.graph = graph

    this.lookupMap = lookupMap

    this._inputs = virtualNode.inputs.map((input) => this.resolveInput(input))

    lookupMap[virtualNode.id] = this

    this._parents = parents
  }

  protected addParent(parent: VirtualAudioGraphNode) {
    this._parents.push(parent)
  }

  protected destroyInput(nodeId: string) {
    const index = this._inputs.findIndex(({ id }) => id === nodeId)
    if (index === -1) {
      console.warn(
        `Node ID '${nodeId}' not found in inputs of node ID '${this.id}'`
      ) /** @todo verbosity-configurable logger */
      return
    }
    this._inputs[index].destroy()
    this.inputs.splice(
      this.inputs.findIndex(({ id }) => id === nodeId),
      1
    )
  }

  private resolveInput(
    vNode: VirtualAudioNodeOfKind<"effect" | "source">
  ): VirtualAudioGraphNodeOfKind<"effect" | "source"> {
    const existing = this.lookupMap[vNode.id]
    if (existing) {
      if (existing.parents.find((parent) => parent === this)) {
        console.warn(`Node '${vNode.id}' is already an input of '${this.id}'`)
      } else {
        existing.addParent(this)
      }
      return existing as VirtualAudioGraphNodeOfKind<"effect" | "source">
    }
    return new VirtualAudioGraphNode<AudioNodeNameOfKind<"effect" | "source">>(
      vNode,
      this.lookupMap,
      [this],
      this.graph
    )
  }

  private _isDestroyed = false
  private _id: string
  private _name: Name
  private _options: AudioNodeClassOptions<Name>
  private _virtualNode: VirtualAudioNode<Name>
  private _inputs: VirtualAudioGraphNode<
    AudioNodeNameOfKind<"effect" | "source">
  >[] = []
  private _parents: VirtualAudioGraphNode[]
  private lookupMap: NodeLookupMap
  private graph: VirtualAudioGraph
}
