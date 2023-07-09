import type { Branded } from "@@core/internal/util/types"
import { MockInternals } from "@@test-utils/mockWebAudio/api/baseMock/"
import {
  createDeviceSettings,
  DeviceSettings,
  validateDeviceSettings,
} from "@@test-utils/mockWebAudio/util/deviceSettings"
import { MockWebAudioApi } from "../api"
import { BaseMock } from "../api/baseMock/baseMock"

export interface EngineContextOptions {
  deviceSettings?: Partial<DeviceSettings>
  mockApi: MockWebAudioApi
}

type InitializedMockConstructor<T extends typeof BaseMock> = Branded<
  T,
  "InitializedMockControllerConstructor"
>

const MOCK_CONSTRUCTOR_CONTEXT_MAP = new WeakMap<
  typeof BaseMock,
  EngineContext
>()

export const initializeMockConstructor = <T extends typeof BaseMock>(
  mockConstructor: T,
  context: EngineContext
): InitializedMockConstructor<T> => {
  const uniqueSubclass =
    class extends (mockConstructor as any) {} as unknown as T

  Object.assign(uniqueSubclass, {
    name: mockConstructor.name,
  })

  MOCK_CONSTRUCTOR_CONTEXT_MAP.set(uniqueSubclass, context)

  return uniqueSubclass as InitializedMockConstructor<T>
}

export class EngineContext {
  constructor(options?: EngineContextOptions) {
    this._deviceSettings = createDeviceSettings(options?.deviceSettings)

    validateDeviceSettings(this._deviceSettings)

    for (const [name, constructor] of Object.entries(options?.mockApi ?? {})) {
      this._mockApi[name as keyof MockWebAudioApi] = initializeMockConstructor(
        constructor as any,
        this
      )
    }
  }

  get deviceSettings() {
    return this._deviceSettings
  }

  get mockApi() {
    return this._mockApi
  }

  protected _deviceSettings: DeviceSettings

  protected _mockApi = {} as MockWebAudioApi
}

export const createEngineContext = (options?: EngineContextOptions) =>
  new EngineContext(options)

// eslint-disable-next-line @typescript-eslint/ban-types
const getInheritance = (constructor: Function): Function[] => {
  const classes = [constructor]
  let currentConstructor = constructor

  while (Object.getPrototypeOf(currentConstructor) !== null) {
    const parentConstructor = Object.getPrototypeOf(currentConstructor)
    classes.push(parentConstructor)
    currentConstructor = parentConstructor
  }

  return classes
}

export const getEngineContext = (
  mock: typeof BaseMock | BaseMock<any> | MockInternals<any>
) => {
  const constructor =
    mock instanceof MockInternals
      ? mock.mock
      : mock instanceof BaseMock
      ? mock.constructor
      : mock
  for (const cls of getInheritance(constructor)) {
    const context = MOCK_CONSTRUCTOR_CONTEXT_MAP.get(cls as typeof BaseMock)
    if (context) return context
  }
  throw new Error("Could not find context for mock")
}
