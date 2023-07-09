import { createMockWebAudioApi } from "../api"
import {
  createEngineContext,
  EngineContext,
  EngineContextOptions,
} from "./engineContext"

export type MockWebAudioEngineOptions = Omit<EngineContextOptions, "mockApi">

export type MockWebAudioEngineApi = {
  [K in keyof EngineContext["mockApi"]]: typeof globalThis[K]
}

class _MockWebAudioEngine {
  constructor(engineContext?: EngineContext) {
    this._context = engineContext ?? createEngineContext()
  }

  get api() {
    return this._context.mockApi as unknown as MockWebAudioEngineApi
  }

  protected _context: EngineContext
}

export type MockWebAudioEngine = _MockWebAudioEngine

export const createMockWebAudioEngine = (
  options?: MockWebAudioEngineOptions
): MockWebAudioEngine => {
  const engineContext = createEngineContext({
    ...options,
    mockApi: createMockWebAudioApi(),
  })

  const engine = new _MockWebAudioEngine(engineContext)

  return engine
}
