/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

import { ConstructorNameToString } from "../../../internal/util/decorators"
import { getGlobalDeviceSetting } from "../../../internal/util/deviceSettings"
import {
  NativeAudioNode,
  NativeBaseAudioContext,
} from "../../../internal/util/nativeTypes"
import { BaseAudioContext } from "../../audioContext"

/** https://developer.mozilla.org/en-US/docs/Web/API/AudioNode */
@ConstructorNameToString
export class AudioNode extends EventTarget implements NativeAudioNode {
  constructor(context: BaseAudioContext, options?: any) {
    super()
    if (this.constructor === AudioNode) {
      throw new TypeError("Illegal constructor")
    }
    if (!context) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': 1 argument required, but only 0 present.`
      )
    }
    if (!(context instanceof BaseAudioContext)) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': parameter 1 is not of type 'BaseAudioContext'.`
      )
    }
    this._context = context as unknown as NativeBaseAudioContext
    if (options) {
      /** @todo review how options are set */
      for (const [key, value] of Object.entries(options)) {
        ;(this as any)[key] = value
      }
    }
  }

  get channelCount() {
    return this._channelCount
  }

  set channelCount(value) {
    if (value < 1 || value > getGlobalDeviceSetting("maxChannels")) {
      throw new TypeError(
        `Failed to set the 'channelCount' property on 'AudioNode': The provided value (${value}) is outside the range [1, ${getGlobalDeviceSetting(
          "maxChannels"
        )}].`
      )
    }
    this._channelCount = parseInt(Number(value) as unknown as string)
  }

  get channelCountMode() {
    return this._channelCountMode
  }

  set channelCountMode(value) {
    if (!["max", "clamped-max", "explicit"].includes(value as string)) {
      throw new TypeError(
        `Failed to set the 'channelCountMode' property on 'AudioNode': The provided value (${value}) is not one of 'max', 'clamped-max', or 'explicit'.`
      )
    }
    this._channelCountMode = value
  }

  get channelInterpretation() {
    return this._channelInterpretation
  }

  connect(
    destinationNode: AudioNode,
    output?: number,
    input?: number
  ): AudioNode

  connect(destinationParam: AudioParam, output?: number): void

  connect(
    destination: AudioNode | AudioParam,
    output?: number,
    input?: number
  ) {
    if (
      typeof output === "number" &&
      (output > this.numberOfOutputs - 1 || output < 0)
    ) {
      throw new DOMException(
        `Uncaught DOMException: Failed to execute 'connect' on 'AudioNode': output index (${output}) exceeds number of outputs (${this.numberOfOutputs}).`
      )
    }
    if (
      typeof input === "number" &&
      (input > this.numberOfInputs - 1 || input < 0)
    ) {
      throw new DOMException(
        `Uncaught DOMException: Failed to execute 'connect' on 'AudioNode': input index (${output}) exceeds number of input (${this.numberOfInputs}).`
      )
    }
    if (destination instanceof AudioNode) {
      return destination
    }
  }

  get context() {
    return this._context
  }

  disconnect(): void

  disconnect(output: number): void

  disconnect(destinationNode: AudioNode): void

  disconnect(destinationNode: AudioNode, output: number): void

  disconnect(destinationParam: AudioParam): void

  disconnect(destinationParam: AudioParam, output: number): void

  disconnect(
    _destinationNodeOrOutput?: AudioNode | AudioParam | number,
    _output?: number,
    _input?: number
  ): void {}

  get numberOfInputs() {
    return 1
  }

  get numberOfOutputs() {
    return 1
  }

  protected _channelCountMode: ChannelCountMode = "max"

  protected _channelInterpretation: ChannelInterpretation = "speakers"

  protected _channelCount = 1

  protected _context: NativeBaseAudioContext
}
