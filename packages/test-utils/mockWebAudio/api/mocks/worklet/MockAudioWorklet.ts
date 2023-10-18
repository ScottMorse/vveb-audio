import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockWebAudioApi } from "../../mockApiType"
import { createMockFactory } from "../../mockFactory"
import { ALLOW_WORKLET_CONSTRUCTOR } from "./MockWorklet"

export const createAudioWorkletMock = createMockFactory<
  typeof AudioWorklet,
  any
>(({ mockEnvironment }) => {
  @MockConstructorName("AudioWorklet")
  class MockAudioWorklet extends mockEnvironment.api.Worklet {}

  return MockAudioWorklet
})

export const createMockAudioWorklet = (api: MockWebAudioApi) =>
  new api.AudioWorklet(...([ALLOW_WORKLET_CONSTRUCTOR] as unknown as []))
