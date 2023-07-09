import { createAudioBufferMock } from "./audioBuffer"
import { createAudioContextMock } from "./audioContext"
import { createAudioListenerMock } from "./audioListener"
import { createAudioNodeMock } from "./audioNode"
import { createAudioParamMock } from "./audioParam"
import { createMediaStreamMock } from "./mediaStream"
import { createPeriodicWaveMock } from "./periodicWave"
import { createAudioWorkletMock } from "./worklet"

export const createMockWebAudioApi = () => ({
  ...createAudioBufferMock(),
  ...createAudioContextMock(),
  ...createAudioListenerMock(),
  ...createAudioNodeMock(),
  ...createAudioParamMock(),
  ...createMediaStreamMock(),
  ...createAudioWorkletMock(),
  ...createPeriodicWaveMock(),
})

export type MockWebAudioApi = ReturnType<typeof createMockWebAudioApi>
