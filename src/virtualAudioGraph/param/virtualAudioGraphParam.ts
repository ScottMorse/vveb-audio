import { Logger } from "@/lib/logger"
import { AudioNodeName, AudioParamName } from "@/nativeWebAudio"
import { VirtualAudioGraphContext } from "../context"
import { VirtualAudioGraphNode, AudioNodeRenderer } from "../node"
import { VirtualAudioParam } from "./virtualAudioParam"

const logger = new Logger({ contextName: "VirtualAudioGraphParam" })

export type VirtualAudioGraphParamCallback<
  Name extends AudioNodeName = AudioNodeName
> = (data: { param: VirtualAudioGraphParam<Name> }) => void

export class VirtualAudioGraphParam<
  Name extends AudioNodeName = AudioNodeName
> {
  get name() {
    return this._name
  }

  get value() {
    return this._virtualParam.value
  }

  set value(value: number) {
    const audioParam = this.resolveAudioParam(false)
    if (audioParam) {
      audioParam.value = value
      this._virtualParam.value = audioParam.value
    } else {
      this._virtualParam.value = value
    }
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

  set automationRate(automationRate: AutomationRate) {
    const audioParam = this.resolveAudioParam(false)
    if (audioParam) {
      audioParam.automationRate = automationRate
      this._virtualParam.automationRate = audioParam.automationRate
    } else {
      this._virtualParam.automationRate = automationRate
    }
  }

  syncValuesWithRealParam() {
    const audioNode = this._nodeRenderer.audioNode
    if (audioNode) {
      const param = audioNode[this._name] as AudioParam
      Object.assign(this._virtualParam, {
        value: param.value,
        automationRate: param.automationRate,
      })
      logger.debug(
        `Synced virtual audio node param '${this._name as string}' of node '${
          this._node.id
        }' with its AudioParam`,
        { virtualParam: this._virtualParam, param }
      )
      return param
    }
  }

  cancelAndHoldAtTime(
    cancelTime: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (this.resolveAudioParam()?.cancelAndHoldAtTime(cancelTime)) {
      this.updateAtEstimatedTime(cancelTime, "cancelAndHoldAtTime", callback)
    }
    return this
  }

  cancelScheduledValues(
    cancelTime: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (this.resolveAudioParam()?.cancelScheduledValues(cancelTime)) {
      this.updateAtEstimatedTime(cancelTime, "cancelScheduledValues", callback)
    }
    return this
  }

  exponentialRampToValueAtTime(
    value: number,
    endTime: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (
      this.resolveAudioParam()?.exponentialRampToValueAtTime(value, endTime)
    ) {
      this.updateAtEstimatedTime(
        endTime,
        "exponentialRampToValueAtTime",
        callback
      )
    }
    return this
  }

  linearRampToValueAtTime(
    value: number,
    endTime: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (this.resolveAudioParam()?.linearRampToValueAtTime(value, endTime)) {
      this.updateAtEstimatedTime(endTime, "linearRampToValueAtTime", callback)
    }
    return this
  }

  setTargetAtTime(
    target: number,
    startTime: number,
    timeConstant: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (
      this.resolveAudioParam()?.setTargetAtTime(target, startTime, timeConstant)
    ) {
      this.updateAtEstimatedTime(startTime, "setTargetAtTime", callback)
    }
    return this
  }

  setValueAtTime(
    value: number,
    startTime: number,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (this.resolveAudioParam()?.setValueAtTime(value, startTime)) {
      this.updateAtEstimatedTime(startTime, "setValueAtTime", callback)
    }
    return this
  }

  setValueCurveAtTime(
    values: Float32Array,
    startTime: number,
    duration: number
  ) {
    if (
      this.resolveAudioParam()?.setValueCurveAtTime(values, startTime, duration)
    ) {
      this.updateAtEstimatedTime(startTime + duration, "setValueCurveAtTime")
    }
    return this
  }

  cancelCallbacks() {
    for (const timeoutId of Object.keys(this._callbackTimeouts)) {
      clearTimeout(timeoutId as any)
      delete this._callbackTimeouts[timeoutId]
    }
  }

  constructor(
    private _name: AudioParamName<Name>,
    private _virtualParam: VirtualAudioParam,
    private _node: VirtualAudioGraphNode,
    private _nodeRenderer: AudioNodeRenderer<Name>,
    private _context: VirtualAudioGraphContext
  ) {}

  private updateAtEstimatedTime(
    time: number,
    logName: string,
    callback?: VirtualAudioGraphParamCallback<Name>
  ) {
    if (this._context.audioContext) {
      const ms = (time - this._context.audioContext.currentTime) * 1000 + 10
      const timeout: number = setTimeout(() => {
        this.syncValuesWithRealParam()
        callback?.({
          param: this,
        })
        logger.debug(
          `Audio param estimated callback for '${
            this._name as string
          }' of node '${this._node.id}': ${logName}`,
          { time, ms, virtualParam: this }
        )
        delete this._callbackTimeouts[timeout]
      }, ms) as any
      this._callbackTimeouts[timeout] = true
    } else {
      logger.warn(`Cannot updateAtEstimatedTime: AudioContext is not rendered`)
    }
  }

  private resolveAudioParam(warn = false) {
    if (this._nodeRenderer.audioNode) {
      return this._nodeRenderer.audioNode[this._name] as AudioParam
    }
    if (warn) {
      logger.warn(
        `AudioParam '${this._name as string}' is not rendered at node '${
          this._node.id
        }'`
      )
    }
    return null
  }

  private _callbackTimeouts: { [key: string | number]: true } = {}
}
