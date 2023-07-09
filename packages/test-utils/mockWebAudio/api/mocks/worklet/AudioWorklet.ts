import { EngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { ALLOW_WORKLET_CONSTRUCTOR, MockWorklet } from "./Worklet"

export class MockAudioWorklet extends MockWorklet {}

export const createMockAudioWorklet = (engineContext: EngineContext) =>
  new (engineContext.mockApi.AudioWorklet)(
    ALLOW_WORKLET_CONSTRUCTOR
  )
