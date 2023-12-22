import {
  MockEnvironment,
  MockInternals,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { isInstanceType } from "@@test-utils/mockWebAudio/util/instanceType"
import { convertUnsigned32Int } from "@@test-utils/mockWebAudio/util/number"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import {
  AUDIO_GRAPH_VALIDATION_ERRORS,
  connectGraphNode,
  ConnectGraphNodeOptions,
  disconnectGraphNode,
  DisconnectGraphNodeOptions,
  validateConnectGraphNode,
  validateDisconnectGraphNode,
} from "../../audioContext/base/audioGraph"

// in Chrome, non-finite-numbers are ignored
const sanitizePinIndex = (value: unknown) =>
  !isFinite(value as number) || isNaN(value as number)
    ? 0
    : convertUnsigned32Int(value)

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
    output = sanitizePinIndex(output)
    input = sanitizePinIndex(input)

    const isAudioNodeDestination = isInstanceType(
      destination,
      "AudioNode",
      this.mockEnvironment.api
    )

    const isAudioParamDestination = isInstanceType(
      destination,
      "AudioParam",
      this.mockEnvironment.api
    )

    if (!isAudioNodeDestination && !isAudioParamDestination) {
      throw new TypeError(
        `Failed to execute 'connect' on 'AudioNode': Overload resolution failed.`
      )
    }

    const options: ConnectGraphNodeOptions = {
      source: this.mock,
      destination,
      output,
      input,
      context: this.context,
    }

    const error = validateConnectGraphNode(options)

    if (error) {
      switch (error) {
        case AUDIO_GRAPH_VALIDATION_ERRORS.contextMisMatch:
          throw new DOMException(
            "Failed to execute 'connect' on 'AudioNode': cannot connect to an AudioNode belonging to a different audio context.",
            "InvalidAccessError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.inputOutsideRange:
          throw new DOMException(
            `Failed to execute 'connect' on 'AudioNode': input index (${input}) exceeds number of inputs (${this.numberOfInputs}).`,
            "IndexSizeError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.outputOutsideRange:
          throw new DOMException(
            `Failed to execute 'connect' on 'AudioNode': output index (${output}) exceeds number of outputs (${this.numberOfOutputs}).`,
            "IndexSizeError"
          )
      }
      throw new Error(error)
    }

    connectGraphNode({
      source: this.mock,
      destination,
      output,
      input,
      context: this.context,
    })

    if (isAudioNodeDestination) {
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
    destinationNodeOrOutput?: AudioNode | AudioParam | number,
    output?: number,
    input?: number
  ) {
    destinationNodeOrOutput =
      typeof destinationNodeOrOutput === "number"
        ? sanitizePinIndex(destinationNodeOrOutput)
        : destinationNodeOrOutput

    const isAudioNodeDestination = isInstanceType(
      destinationNodeOrOutput,
      "AudioNode",
      this.mockEnvironment.api
    )

    const isAudioParamDestination = isInstanceType(
      destinationNodeOrOutput,
      "AudioParam",
      this.mockEnvironment.api
    )

    if (typeof input === "number" && !isAudioNodeDestination) {
      throw new TypeError(
        "Failed to execute 'disconnect' on 'AudioNode': Parameter 1 is not of type 'AudioNode'."
      )
    }

    if (
      typeof output === "number" &&
      !(isAudioNodeDestination || isAudioParamDestination)
    ) {
      throw new TypeError(
        "Failed to execute 'disconnect' on 'AudioNode': Overload resolution failed."
      )
    }

    output = sanitizePinIndex(output)
    input = sanitizePinIndex(input)

    const options: DisconnectGraphNodeOptions = {
      source: this.mock,
      destination: destinationNodeOrOutput,
      output,
      input,
      context: this.context,
    }

    const error = validateDisconnectGraphNode(options)
    if (error) {
      switch (error) {
        case AUDIO_GRAPH_VALIDATION_ERRORS.contextMisMatch:
          throw new DOMException(
            "Failed to execute 'disconnect' on 'AudioNode': cannot disconnect from an AudioNode belonging to a different audio context.",
            "InvalidAccessError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.inputOutsideRange:
          throw new DOMException(
            `Failed to execute 'disconnect' on 'AudioNode': input index (${input}) exceeds number of inputs (${this.numberOfInputs}).`,
            "IndexSizeError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.outputOutsideRange:
          throw new DOMException(
            `Failed to execute 'disconnect' on 'AudioNode': output index provided (${output}) is outside the range [0, ${this.numberOfOutputs}].`,
            "IndexSizeError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.nodeNotConnected:
          throw new DOMException(
            `Failed to execute 'disconnect' on 'AudioNode': the given destination is not connected.`,
            "InvalidAccessError"
          )
        case AUDIO_GRAPH_VALIDATION_ERRORS.outputNotConnected:
          throw new DOMException(
            `Failed to execute 'disconnect' on 'AudioNode': output (${output}) is not connected to the input (${input}) of the destination.`,
            "InvalidAccessError"
          )
      }
      throw new Error(error)
    }

    disconnectGraphNode(options)
  }

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
