import {
  BaseMock,
  getInternals,
  MockConstructorName,
} from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNodeInternals } from "./MockAudioNodeInternals"

@MockConstructorName("AudioNode")
export class MockAudioNode<I extends MockAudioNodeInternals = MockAudioNodeInternals>
  extends BaseMock<I>
  implements AudioNode
{
  constructor(
    context: BaseAudioContext,
    options?: any,
    _internals?: I
  ) {
    super(_internals ?? new MockAudioNodeInternals(context, options) as I)
    if (new.target === MockAudioNode) {
      throw new TypeError("Illegal constructor")
    }
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    return getInternals(this).addEventListener(type, callback, options)
  }

  get channelCount() {
    return getInternals(this).channelCount
  }

  set channelCount(value) {
    getInternals(this).channelCount = value
  }

  get channelCountMode() {
    return getInternals(this).channelCountMode
  }

  set channelCountMode(value) {
    getInternals(this).channelCountMode = value
  }

  get channelInterpretation() {
    return getInternals(this).channelInterpretation
  }

  connect(
    destinationNode: AudioNode,
    output?: number | undefined,
    input?: number | undefined
  ): AudioNode

  connect(destinationParam: AudioParam, output?: number | undefined): void

  connect(
    destinationNode: AudioNode | AudioParam,
    output?: number,
    input?: number
  ): void | AudioNode {
    return getInternals(this).connect(destinationNode as any, output, input)
  }

  get context() {
    return getInternals(this).context
  }

  disconnect(): void

  disconnect(output: number): void

  disconnect(destinationNode: AudioNode): void

  disconnect(destinationNode: AudioNode, output: number): void

  disconnect(destinationNode: AudioNode, output: number, input: number): void

  disconnect(destinationParam: AudioParam): void

  disconnect(destinationParam: AudioParam, output: number): void

  disconnect(
    destinationNode?: AudioNode | AudioParam | number,
    output?: number,
    input?: number
  ) {
    ;(getInternals(this) as any).disconnect(destinationNode, output, input)
  }

  dispatchEvent(event: Event) {
    return getInternals(this).dispatchEvent(event)
  }

  get numberOfInputs() {
    return getInternals(this).numberOfInputs
  }

  get numberOfOutputs() {
    return getInternals(this).numberOfOutputs
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return getInternals(this).removeEventListener(type, callback, options)
  }
}
