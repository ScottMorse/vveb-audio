import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { AudioGraphNode } from "../../audioContext/base/audioGraph"
import { MockAudioNodeInternals } from "./MockAudioNodeInternals"

export type MockAudioNodeArgs = [BaseAudioContext, AudioNodeOptions?]

const AUDIO_GRAPH_MAP = new WeakMap<
  AudioNode,
  {
    graphNode: AudioGraphNode
    context: BaseAudioContext
  }
>()

export const createAudioNodeMock = createMockFactory<
  typeof AudioNode,
  MockAudioNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioNode")
  class MockAudioNode<I extends MockAudioNodeInternals = MockAudioNodeInternals>
    extends EventTarget
    implements AudioNode
  {
    constructor(...[context, options]: MockAudioNodeArgs) {
      super()

      if (new.target === MockAudioNode) {
        throw new TypeError("Illegal constructor")
      }

      setInternals(
        this,
        new MockAudioNodeInternals(this, mockEnvironment, context, options)
      )

      AUDIO_GRAPH_MAP.set(this, {
        graphNode: new AudioGraphNode(this),
        context,
      })
    }

    get channelCount(): number {
      return getInternals(this).channelCount
    }

    set channelCount(value) {
      getInternals(this).channelCount = value
    }

    get channelCountMode(): ChannelCountMode {
      return getInternals(this).channelCountMode
    }

    set channelCountMode(value) {
      getInternals(this).channelCountMode = value
    }

    get channelInterpretation(): ChannelInterpretation {
      return getInternals(this).channelInterpretation
    }

    set channelInterpretation(value) {
      getInternals(this).channelInterpretation = value
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

    get context(): BaseAudioContext {
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

    get numberOfInputs(): number {
      return getInternals(this).numberOfInputs
    }

    get numberOfOutputs(): number {
      return getInternals(this).numberOfOutputs
    }
  }

  return MockAudioNode as typeof AudioNode
})

export const getGraphAudioNode = (node: AudioNode) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AUDIO_GRAPH_MAP.get(node)!
}
