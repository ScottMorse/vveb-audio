import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockBaseAudioContext } from "../../audioContext/base/MockBaseAudioContext"

export class MockAudioNodeInternals
  extends MockInternals<AudioNode>
  implements AudioNode
{
  protected eventTarget = new EventTarget()

  constructor(context: BaseAudioContext, options?: any) {
    super()
    if (!context) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': 1 argument required, but only 0 present.`
      )
    }
    if (!(context instanceof MockBaseAudioContext)) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': parameter 1 is not of type 'BaseAudioContext'.`
      )
    }
    this._context = context as unknown as BaseAudioContext

    if (options) {
      /** @todo review how options are set */
      for (const [key, value] of Object.entries(options)) {
        ;(this as any)[key] = value
      }
    }
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    return this.eventTarget.addEventListener(type, callback, options)
  }

  get channelCount() {
    return this._channelCount
  }

  set channelCount(value) {
    if (
      value < 1 ||
      value > getEngineContext(this).deviceSettings.maxChannels
    ) {
      throw new TypeError(
        `Failed to set the 'channelCount' property on 'AudioNode': The provided value (${value}) is outside the range [1, ${
          getEngineContext(this).deviceSettings.maxChannels
        }].`
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
    if (destination instanceof getEngineContext(this).mockApi.AudioNode) {
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
  ) {}

  dispatchEvent(event: Event) {
    return this.eventTarget.dispatchEvent(event)
  }

  get numberOfInputs() {
    return 1
  }

  get numberOfOutputs() {
    return 1
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return this.eventTarget.removeEventListener(type, callback, options)
  }

  protected _channelCountMode: ChannelCountMode = "max"

  protected _channelInterpretation: ChannelInterpretation = "speakers"

  protected _channelCount = 1

  protected _context: BaseAudioContext
}
