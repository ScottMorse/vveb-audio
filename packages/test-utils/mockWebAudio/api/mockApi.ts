import {
  createDeviceSettings,
  DeviceSettings,
} from "@@test-utils/mockWebAudio/util/deviceSettings"
import { MockWebAudioApi } from "./mockFactory"
import { createAudioBufferMock } from "./mocks/audioBuffer"
import {
  createAudioContextMock,
  createBaseAudioContextMock,
  createOfflineAudioCompletionEventMock,
  createOfflineAudioContextMock,
} from "./mocks/audioContext"
import { createAudioListenerMock } from "./mocks/audioListener"
import { createAudioNodeMock } from "./mocks/audioNode/base"
import {
  createAnalyserNodeMock,
  createAudioBufferSourceNodeMock,
  createBiquadFilterNodeMock,
  createChannelMergerNodeMock,
  createChannelSplitterNodeMock,
  createConstantSourceNodeMock,
  createConvolverNodeMock,
  createDelayNodeMock,
  createDynamicsCompressorNodeMock,
  createGainNodeMock,
  createIIRFilterNodeMock,
  createMediaElementAudioSourceNodeMock,
  createMediaStreamAudioDestinationNodeMock,
  createMediaStreamAudioSourceNodeMock,
  createOscillatorNodeMock,
  createPannerNodeMock,
  createStereoPannerNodeMock,
  createWaveShaperNodeMock,
} from "./mocks/audioNode/creatableSubclasses"
import { createAudioDestinationNodeMock } from "./mocks/audioNode/destination/MockAudioDestinationNode"
import { createAudioScheduledSourceNodeMock } from "./mocks/audioNode/scheduledSource/MockAudioScheduledSourceNode"
import { createAudioWorkletNodeMock } from "./mocks/audioNode/worklet"
import { createAudioParamMock } from "./mocks/audioParam"
import { createAudioParamMapMock } from "./mocks/audioParamMap"
import { createMediaStreamMock } from "./mocks/mediaStream/stream"
import {
  createMediaStreamTrackEventMock,
  createMediaStreamTrackMock,
} from "./mocks/mediaStream/track"
import { createMessagePortMock } from "./mocks/messagePort"
import { createPeriodicWaveMock } from "./mocks/periodicWave"
import { createAudioWorkletMock, createWorkletMock } from "./mocks/worklet"

export interface CreateMockWebAudioApiOptions {
  deviceSettings?: Partial<DeviceSettings>
}

export const createMockWebAudioApi = (
  options?: CreateMockWebAudioApiOptions
) => {
  const api = {} as MockWebAudioApi
  const deviceSettings = createDeviceSettings(options?.deviceSettings)

  const mockEnvironment = { api, deviceSettings }

  api.MessagePort = createMessagePortMock(mockEnvironment)

  api.Worklet = createWorkletMock(mockEnvironment)
  api.AudioWorklet = createAudioWorkletMock(mockEnvironment)

  api.MediaStream = createMediaStreamMock(mockEnvironment)
  api.MediaStreamTrack = createMediaStreamTrackMock(mockEnvironment)
  api.MediaStreamTrackEvent = createMediaStreamTrackEventMock(mockEnvironment)

  api.AudioBuffer = createAudioBufferMock(mockEnvironment)
  api.AudioParam = createAudioParamMock(mockEnvironment)
  api.AudioParamMap = createAudioParamMapMock(mockEnvironment)
  api.PeriodicWave = createPeriodicWaveMock(mockEnvironment)
  api.AudioListener = createAudioListenerMock(mockEnvironment)

  api.BaseAudioContext = createBaseAudioContextMock(mockEnvironment)
  api.AudioContext = createAudioContextMock(mockEnvironment)
  api.OfflineAudioCompletionEvent =
    createOfflineAudioCompletionEventMock(mockEnvironment)
  api.OfflineAudioContext = createOfflineAudioContextMock(mockEnvironment)

  api.AudioNode = createAudioNodeMock(mockEnvironment)
  api.AudioDestinationNode = createAudioDestinationNodeMock(mockEnvironment)
  api.AudioScheduledSourceNode =
    createAudioScheduledSourceNodeMock(mockEnvironment)
  api.AudioWorkletNode = createAudioWorkletNodeMock(mockEnvironment)
  api.AnalyserNode = createAnalyserNodeMock(mockEnvironment)
  api.AudioBufferSourceNode = createAudioBufferSourceNodeMock(mockEnvironment)
  api.BiquadFilterNode = createBiquadFilterNodeMock(mockEnvironment)
  api.ChannelMergerNode = createChannelMergerNodeMock(mockEnvironment)
  api.ChannelSplitterNode = createChannelSplitterNodeMock(mockEnvironment)
  api.ConstantSourceNode = createConstantSourceNodeMock(mockEnvironment)
  api.ConvolverNode = createConvolverNodeMock(mockEnvironment)
  api.DelayNode = createDelayNodeMock(mockEnvironment)
  api.DynamicsCompressorNode = createDynamicsCompressorNodeMock(mockEnvironment)
  api.GainNode = createGainNodeMock(mockEnvironment)
  api.IIRFilterNode = createIIRFilterNodeMock(mockEnvironment)
  api.MediaElementAudioSourceNode =
    createMediaElementAudioSourceNodeMock(mockEnvironment)
  api.MediaStreamAudioSourceNode =
    createMediaStreamAudioSourceNodeMock(mockEnvironment)
  api.MediaStreamAudioDestinationNode =
    createMediaStreamAudioDestinationNodeMock(mockEnvironment)
  api.OscillatorNode = createOscillatorNodeMock(mockEnvironment)
  api.PannerNode = createPannerNodeMock(mockEnvironment)
  api.StereoPannerNode = createStereoPannerNodeMock(mockEnvironment)
  api.WaveShaperNode = createWaveShaperNodeMock(mockEnvironment)

  return api
}
