import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory, MockWebAudioApi } from "../../mockFactory"
import { AudioGraphNode } from "../audioContext/base/audioGraph"
import {
  MockAudioParamInternals,
  CreateMockAudioParamOptions,
} from "./MockAudioParamInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

const AUDIO_GRAPH_MAP = new WeakMap<
  AudioParam,
  {
    graphNode: AudioGraphNode
    node: AudioNode | AudioListener
    context: BaseAudioContext
  }
>()

export const createAudioParamMock = createMockFactory<
  typeof AudioParam,
  MockAudioParamInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioParam")
  class MockAudioParam implements AudioParam {
    constructor(
      context: BaseAudioContext,
      node: AudioNode,
      options?: CreateMockAudioParamOptions,
      allow?: typeof ALLOW_CONSTRUCTOR
    ) {
      if (allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }

      setInternals(
        this,
        new MockAudioParamInternals(this, mockEnvironment, context, options)
      )

      AUDIO_GRAPH_MAP.set(this, {
        graphNode: new AudioGraphNode(this),
        node,
        context,
      })
    }

    get automationRate() {
      return getInternals(this).automationRate
    }

    set automationRate(automationRate: AutomationRate) {
      getInternals(this).setAutomationRate(automationRate)
    }

    cancelAndHoldAtTime(cancelTime: number) {
      return getInternals(this).cancelAndHoldAtTime(cancelTime)
    }

    cancelScheduledValues(startTime: number) {
      return getInternals(this).cancelScheduledValues(startTime)
    }

    get defaultValue(): number {
      return getInternals(this).defaultValue
    }

    exponentialRampToValueAtTime(value: number, endTime: number) {
      return getInternals(this).exponentialRampToValueAtTime(value, endTime)
    }

    linearRampToValueAtTime(value: number, endTime: number) {
      return getInternals(this).linearRampToValueAtTime(value, endTime)
    }

    get maxValue(): number {
      return getInternals(this).maxValue
    }

    get minValue(): number {
      return getInternals(this).minValue
    }

    setTargetAtTime(target: number, startTime: number, _timeConstant: number) {
      return getInternals(this).setTargetAtTime(
        target,
        startTime,
        _timeConstant
      )
    }

    setValueAtTime(value: number, startTime: number) {
      return getInternals(this).setValueAtTime(value, startTime)
    }

    setValueCurveAtTime(
      values: Float32Array,
      startTime: number,
      duration: number
    ) {
      return getInternals(this).setValueCurveAtTime(values, startTime, duration)
    }

    get value() {
      return getInternals(this).value
    }

    set value(value: number) {
      getInternals(this).setValue(value)
    }
  }

  return MockAudioParam as typeof AudioParam
})

export const createMockAudioParam = (
  api: MockWebAudioApi,
  context: BaseAudioContext,
  node: AudioNode | AudioListener,
  options?: CreateMockAudioParamOptions
) =>
  new api.AudioParam(
    ...([context, options, node, ALLOW_CONSTRUCTOR] as unknown as [])
  )

export const getGraphAudioParam = (param: AudioParam) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AUDIO_GRAPH_MAP.get(param)!
}
