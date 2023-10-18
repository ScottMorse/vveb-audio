import {
  MockEnvironment,
  MockInternals,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { isInstanceType } from "@@test-utils/mockWebAudio/util/instanceType"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"

export class MockAudioNodeInternals
  extends MockInternals<AudioNode>
  implements OmitEventTarget<AudioNode>
{
  protected eventTarget = new EventTarget()

  constructor(
    mock: AudioNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext,
    _options?: AudioNodeOptions
  ) {
    super(mock, mockEnvironment)

    if (!context) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': 1 argument required, but only 0 present.`
      )
    }
    if (!isInstanceType(context, "BaseAudioContext", mockEnvironment.api)) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': parameter 1 is not of type 'BaseAudioContext'.`
      )
    }
    this._context = context
  }

  get channelCount() {
    return this._channelCount
  }

  set channelCount(value: number) {
    if (
      value < 1 ||
      value > this.mockEnvironment.deviceSettings.destinationMaxChannelCount
    ) {
      throw new TypeError(
        `Failed to set the 'channelCount' property on 'AudioNode': The provided value (${value}) is outside the range [1, ${this.mockEnvironment.deviceSettings.destinationMaxChannelCount}].`
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

  set channelInterpretation(value) {
    if (!["speakers", "discrete"].includes(value as string)) {
      throw new TypeError(
        `Failed to set the 'channelInterpretation' property on 'AudioNode': The provided value (${value}) is not one of 'speakers' or 'discrete'.`
      )
    }
    this._channelInterpretation = value
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
  ): AudioNode | void {
    /** @todo NOTE confirm and implement that destination must have numberOfOutputs > 0 */

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
    if (isInstanceType(destination, "AudioNode", this.mockEnvironment.api)) {
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

  get numberOfInputs() {
    return 1
  }

  get numberOfOutputs() {
    return 1
  }

  protected _channelCountMode: ChannelCountMode = "max"

  protected _channelInterpretation: ChannelInterpretation = "speakers"

  protected _channelCount = 1

  protected _context: BaseAudioContext
}
