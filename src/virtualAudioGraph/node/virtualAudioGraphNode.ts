import { logger } from "@/lib/logger"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
  AudioParamName,
  getAudioNodeConfig,
} from "@/nativeWebAudio"
import { VirtualAudioGraphContext } from "../context"
import { VirtualAudioGraph } from "../graph"
import { NodeLookupMap, resolveNodes } from "../graph/lookupMap"
import { VirtualAudioParam, VirtualAudioGraphParam } from "../param"
import { AudioNodeRenderer } from "./audioNodeRenderer"
import {
  CreateVirtualAudioNodeOptionsOrReference,
  NarrowedVirtualAudioNode,
  VirtualAudioNode,
  virtualAudioNodeUtil,
} from "."
/** WARNING: This is a circular dependency, but only used as a type, so it is tolerated */

export type VirtualAudioGraphNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioGraphNode<AudioNodeNameOfKind<Kind>>

export type AddInputOptions<Name extends AudioNodeName> = {
  node:
    | CreateVirtualAudioNodeOptionsOrReference<Name>
    | VirtualAudioGraphNode<Name>
  param?: AudioParamName<Name>
}

export type NarrowedVirtualAudioGraphNode<
  Name extends AudioNodeName = AudioNodeName,
  Kind extends AudioNodeKind = AudioNodeKind
> = VirtualAudioGraphNode<NarrowedVirtualAudioNode<Name, Kind>["name"]>

export type VirtualAudioGraphInput<Name extends AudioNodeName = AudioNodeName> =
  {
    node: VirtualAudioGraphNode<Name>
    param?: AudioParamName<Name>
  }

const hasExistingOutput = (
  node: VirtualAudioGraphNode,
  potentialOutput: VirtualAudioGraphNode | VirtualAudioNode,
  param?: AudioParamName,
  warn = false
) => {
  const hasOutput = !!node.outputs.find(
    (output) =>
      output.node.id === potentialOutput.id &&
      (param === output.param || (!param && !output.param))
  )
  if (warn && hasOutput) {
    logger.warn(
      `Node '${node.id}' is already an input of ${
        param ? `param '${param}' of ` : ""
      }'${potentialOutput.id}'`
    )
  }
  return hasOutput
}

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

  get outputs() {
    return this._outputs
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  get audioNode() {
    return this.renderer.audioNode
  }

  get isPlaying() {
    return this.renderer.isPlaying
  }

  get params() {
    return this._params
  }

  render() {
    this.renderer.render()
  }

  start() {
    this.renderer.start()
  }

  stop() {
    this.renderer.stop()
    Object.values(this.params).forEach((param) =>
      (param as VirtualAudioGraphParam).cancelCallbacks()
    )
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
    const newInputs = resolveNodes(
      inputs.map(({ node }) => node),
      this.lookupMap,
      this.graph,
      this.context
    )
    for (let i = 0; i < newInputs.length; i++) {
      const inputNode = newInputs[i]
      const inputParam = inputs.find(
        ({ node }) =>
          (virtualAudioNodeUtil.isReference(node) ? node.idRef : node.id) ===
          inputNode.id
      )?.param // in case lengths do not match
      const { kind } = getAudioNodeConfig(inputNode.name)
      if (kind.length === 1 && kind[0] === "destination" && !inputParam) {
        logger.warn(
          new Error(
            `Cannot add destination node '${inputNode.id}' as input to node '${this.id}' in graph ${this.graph.id}`
          )
        )
      } else {
        this._inputs.push({
          node: inputNode,
          param: inputParam as AudioParamName,
        })
      }
    }
  }

  destroy() {
    this.inputs.forEach((input) => input.node.destroy())
    this.outputs.forEach((output) => output.node.destroyInput(this.id))
    delete this.lookupMap[this.id]
    this._isDestroyed = true
    return this
  }

  constructor(
    virtualNode: VirtualAudioNode<Name>,
    lookupMap: NodeLookupMap,
    outputs: VirtualAudioGraphInput[],
    graph: VirtualAudioGraph,
    private context: VirtualAudioGraphContext
  ) {
    this._virtualNode = virtualNode
    this._id = virtualNode.id
    this._name = virtualNode.name
    this._options = virtualNode.options

    this.graph = graph

    this.lookupMap = lookupMap

    this._inputs = virtualNode.inputs.map((input) =>
      this.resolveNewInput(input.node, input.param as any)
    ) as VirtualAudioGraphInput<AudioNodeNameOfKind<"effect" | "source">>[]

    lookupMap[virtualNode.id] = this

    this._outputs = outputs

    this.renderer = new AudioNodeRenderer(this, context)

    this._params = Object.entries(virtualNode.params).reduce<
      typeof this._params
    >((params, [paramName, vParam]) => {
      params[paramName as AudioParamName<Name>] = new VirtualAudioGraphParam(
        paramName as AudioParamName<Name>,
        vParam as VirtualAudioParam,
        this,
        this.renderer,
        this.context
      )
      return params
    }, {} as typeof this._params)
  }

  protected addOutput(output: VirtualAudioGraphNode, param?: AudioParamName) {
    if (!hasExistingOutput(this, output, param, true)) {
      this._outputs.push()
    }
  }

  protected destroyInput(nodeId: string, _index: number | null = null) {
    const index =
      typeof _index === "number"
        ? _index
        : this._inputs.findIndex(({ node: { id } }) => id === nodeId)
    if (index === -1) {
      logger.warn(
        `Node ID '${nodeId}' not found in inputs of node ID '${this.id}'`
      )
      return
    }
    this._inputs[index].node.destroy()
    this._inputs.splice(index, 1)
    const nextIndex = this._inputs.findIndex(
      ({ node: { id } }) => id === nodeId
    )
    if (nextIndex > -1) {
      this.destroyInput(nodeId, nextIndex)
    }
  }

  private resolveNewInput(
    vNode: VirtualAudioNode,
    param?: AudioParamName
  ): VirtualAudioGraphInput {
    const existing = this.lookupMap[vNode.id]
    if (existing) {
      existing.addOutput(this, param)
      return {
        node: existing,
        param,
      }
    }

    return {
      node: new VirtualAudioGraphNode(
        vNode,
        this.lookupMap,
        [{ node: this, param }],
        this.graph,
        this.context
      ),
      param,
    }
  }

  private _isDestroyed = false
  private _id: string
  private _name: Name
  private _options: AudioNodeClassOptions<Name>
  private _virtualNode: VirtualAudioNode<Name>
  private _params: {
    [Key in AudioParamName<Name>]: VirtualAudioGraphParam<Name>
  }
  private _inputs: VirtualAudioGraphInput[] = []
  private _outputs: VirtualAudioGraphInput[]
  private lookupMap: NodeLookupMap
  private graph: VirtualAudioGraph
  private renderer: AudioNodeRenderer<Name>
}
