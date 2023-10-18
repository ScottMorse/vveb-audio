import { DeeplyPartial } from "@@core/internal/util/types"
import {
  MockWebAudioEngine,
  createMockWebAudio,
} from "@@test-utils/mockWebAudio"
import {
  DeviceSettings,
  createDeviceSettings,
} from "@@test-utils/mockWebAudio/util/deviceSettings"
import isEqual from "lodash/isEqual"
import merge from "lodash/merge"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { discoverDeviceSettings } from "./discoverDeviceSettings"

export interface AppState {
  audioContext: AudioContext | null
  setAudioContext: (audioContext: AudioContext) => void
  mockAudioContext: AudioContext | null
  setMockAudioContext: (mockAudioContext: AudioContext) => void
  mockWebAudio: MockWebAudioEngine
  deviceSettings: DeviceSettings
  updateDeviceSettings: (settings: DeeplyPartial<DeviceSettings>) => void
}

const appContext = createContext(undefined as unknown as AppState)

export const AppContextProvider = ({ children }: { children?: ReactNode }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [mockAudioContext, setMockAudioContext] = useState<AudioContext | null>(
    null
  )

  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>(
    createDeviceSettings()
  )
  const [mockWebAudio, setMockWebAudio] = useState<MockWebAudioEngine>(
    createMockWebAudio({
      deviceSettings,
    })
  )

  const updateDeviceSettings = useCallback(
    (settings: DeeplyPartial<DeviceSettings>) => {
      const newSettings = merge({}, deviceSettings, settings)
      setDeviceSettings(newSettings)
    },
    [deviceSettings]
  )

  useEffect(() => {
    ;(async () =>
      setDeviceSettings((await discoverDeviceSettings()).settings))()
  }, [])

  useEffect(() => {
    if (!isEqual(deviceSettings, mockWebAudio.deviceSettings)) {
      setMockWebAudio(createMockWebAudio({ deviceSettings }))
    }
    ;(window as unknown as { mock: typeof mockWebAudio }).mock = mockWebAudio
  }, [deviceSettings])

  useEffect(() => {
    if (audioContext) {
      const listener = () => {
        if (audioContext.state === "closed") {
          setAudioContext(new AudioContext())
        }
      }

      audioContext.addEventListener("statechange", listener)

      return () => {
        audioContext.removeEventListener("statechange", listener)
      }
    }
  }, [audioContext])

  useEffect(() => {
    if (mockAudioContext) {
      const listener = () => {
        if (mockAudioContext.state === "closed") {
          setAudioContext(new mockWebAudio.api.AudioContext())
        }
      }

      mockAudioContext.addEventListener("statechange", listener)

      return () => {
        mockAudioContext.removeEventListener("statechange", listener)
      }
    }
  }, [mockAudioContext])

  return (
    <appContext.Provider
      value={{
        audioContext,
        setAudioContext,
        mockAudioContext,
        setMockAudioContext,
        mockWebAudio,
        deviceSettings,
        updateDeviceSettings,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => useContext(appContext)
