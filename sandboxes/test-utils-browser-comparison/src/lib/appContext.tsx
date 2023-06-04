import { createContext, ReactNode, useContext, useState } from "react"
import { Mock } from "./mock"

interface ContextState {
  audioContext: AudioContext | null
  setAudioContext: (audioContext: AudioContext) => void
  mockAudioContext: Mock.AudioContext | null
  setMockAudioContext: (mockAudioContext: Mock.AudioContext) => void
  offlineContext: OfflineAudioContext
  setOfflineContext: (offlineContext: OfflineAudioContext) => void
  mockOfflineContext: Mock.OfflineAudioContext
  setMockOfflineContext: (mockOfflineContext: Mock.OfflineAudioContext) => void
}

const appContext = createContext(undefined as unknown as ContextState)

export const AppContextProvider = ({ children }: { children?: ReactNode }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [mockAudioContext, setMockAudioContext] =
    useState<Mock.AudioContext | null>(null)
  const [offlineContext, setOfflineContext] = useState(
    new OfflineAudioContext(1, 48_000 * 10, 48_000)
  )
  const [mockOfflineContext, setMockOfflineContext] = useState(
    new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
  )

  return (
    <appContext.Provider
      value={{
        audioContext,
        setAudioContext,
        mockAudioContext,
        setMockAudioContext,
        offlineContext,
        setOfflineContext,
        mockOfflineContext,
        setMockOfflineContext,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => useContext(appContext)
