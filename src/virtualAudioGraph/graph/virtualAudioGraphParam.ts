import { AudioNodeName, AudioParamName } from "@/nativeWebAudio"
import { VirtualAudioParam } from "../audioParam"
import { NodeRenderer } from "../renderer/nodeRenderer"
import { VirtualAudioGraphNode } from "./virtualAudioGraphNode"

export class VirtualAudioGraphParam<Name extends AudioNodeName> {
  get name() {
    return this._name
  }

  get value() {
    return this._virtualParam.value
  }

  set value(value: number) {
    this._virtualParam.value = value
  }

  get maxValue() {
    return this._virtualParam.maxValue
  }

  get minValue() {
    return this._virtualParam.minValue
  }

  get defaultValue() {
    return this._virtualParam.defaultValue
  }

  get automationRate() {
    return this._virtualParam.automationRate
  }

  refreshValues() {
    const audioNode = this._nodeRenderer.audioNode
    if (audioNode) {
      const param = audioNode[this._name] as AudioParam
      Object.assign(this._virtualParam, {
        value: param.value,
        maxValue: param.maxValue,
        minValue: param.minValue,
        defaultValue: param.defaultValue,
        automationRate: param.automationRate,
      })
    }
  }

  /** @todo remove eslint-disable once methods implemented  */
  /* eslint-disable @typescript-eslint/no-unused-vars */

  cancelAndHoldAtTime(cancelTime: number) {
    return this._node.params
  }

  cancelScheduledValues(cancelTime: number) {
    return this
  }

  exponentialRampToValueAtTime(value: number, endTime: number) {
    return this
  }

  linearRampToValueAtTime(value: number, endTime: number) {
    return this
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number) {
    return this
  }

  setValueAtTime(value: number, startTime: number) {
    return this
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ) {
    return this
  }

  /* eslint-enable @typescript-eslint/no-unused-vars */

  constructor(
    private _name: AudioParamName<Name>,
    private _virtualParam: VirtualAudioParam,
    private _node: VirtualAudioGraphNode,
    private _nodeRenderer: NodeRenderer<Name>
  ) {}
}
