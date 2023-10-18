import { Constructor } from "@@core/internal/util/types"
import { DeviceSettings } from "@@test-utils/mockWebAudio/util/deviceSettings"
import { MockWebAudioApi } from "../mockApiType"
import { MockInternals } from "./mockInternals"

export type MockEnvironment = {
  deviceSettings: DeviceSettings
  api: MockWebAudioApi
}

export type MockFactoryOptions<
  C extends Constructor,
  M extends MockInternals<any>
> = {
  setInternals(instance: InstanceType<C>, internals: M): void
  getInternals(instance: InstanceType<C>): M
  mockEnvironment: MockEnvironment
}

export type MockConstructorFactory<
  C extends Constructor,
  M extends MockInternals<any>
> = (options: MockFactoryOptions<C, M>) => C

const INTERNALS_MAP = new WeakMap<Constructor, MockInternals<any>>()

export const createMockFactory =
  <C extends Constructor, M extends MockInternals<any>>(
    factory: MockConstructorFactory<C, M>
  ) =>
  (mockEnvironment: MockEnvironment) => {
    const setInternals = (instance: C, internals: M) => {
      INTERNALS_MAP.set(instance, internals)
    }

    const getInternals = (instance: C) => INTERNALS_MAP.get(instance) as M

    return factory({
      setInternals,
      getInternals,
      mockEnvironment,
    })
  }
