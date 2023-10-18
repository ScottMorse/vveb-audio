import { createMockWebAudioApi } from "./api"
import { MockWebAudioApi } from "./api/mockApiType"
import { DeviceSettings, createDeviceSettings } from "./util/deviceSettings"

export interface MockGloballyOptions {
  /**
   * If a member of `globalThis` is already defined, the mock won't be set for it.
   * For example, if `MediaStream` is already present globally, it will not be replaced.
   */
  excludeExisting?: boolean
}

export interface MockWebAudioEngine {
  readonly api: MockWebAudioApi
  readonly deviceSettings: DeviceSettings
  mockGlobally(): void
}

export interface CreateMockWebAudioOptions {
  deviceSettings?: Partial<DeviceSettings>
}

export const createMockWebAudio = (
  options?: CreateMockWebAudioOptions
): MockWebAudioEngine => {
  const deviceSettings = createDeviceSettings(options?.deviceSettings)
  const api = createMockWebAudioApi({ deviceSettings })

  return {
    api,
    deviceSettings,
    mockGlobally: (options?: MockGloballyOptions) => {
      Object.entries(api).forEach(([keyName, constructor]) => {
        if (
          options?.excludeExisting &&
          globalThis[keyName as keyof typeof globalThis]
        ) {
          return
        }

        Object.assign(globalThis, {
          [keyName]: constructor,
        })
      })
    },
  }
}
