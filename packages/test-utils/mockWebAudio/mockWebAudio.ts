import {
  DeviceSettings,
  resetGlobalDeviceSettings,
  setGlobalDeviceSettings,
} from "../internal/util/deviceSettings"
import { mockGlobalAudioBuffer, unMockGlobalAudioBuffer } from "./audioBuffer"
import {
  mockGlobalAudioContext,
  unMockGlobalAudioContext,
} from "./audioContext"
import {
  mockGlobalAudioListener,
  unMockGlobalAudioListener,
} from "./audioListener"
import { mockGlobalAudioNodes, unMockGlobalAudioNodes } from "./audioNode"
import { mockGlobalMediaStream, unMockGlobalMediaStream } from "./mediaStream"
import {
  mockGlobalPeriodicWave,
  unMockGlobalPeriodicWave,
} from "./periodicWave"
import { mockGlobalWorklets, unMockGlobalWorklets } from "./worklet"

new AudioContext().createAnalyser()

export interface MockGlobalWebAudioOptions {
  deviceSettings?: Partial<DeviceSettings>
}

export const mockGlobalWebAudio = (options?: MockGlobalWebAudioOptions) => {
  setGlobalDeviceSettings(options?.deviceSettings ?? {}, {
    resetOtherFields: true,
  })

  mockGlobalMediaStream()
  mockGlobalPeriodicWave()
  mockGlobalAudioBuffer()
  mockGlobalWorklets()
  mockGlobalAudioListener()
  mockGlobalAudioContext()
  mockGlobalAudioNodes()
}

export const unMockGlobalWebAudio = () => {
  resetGlobalDeviceSettings()

  unMockGlobalMediaStream()
  unMockGlobalPeriodicWave()
  unMockGlobalAudioBuffer()
  unMockGlobalWorklets()
  unMockGlobalAudioListener()
  unMockGlobalAudioContext()
  unMockGlobalAudioNodes()
}
