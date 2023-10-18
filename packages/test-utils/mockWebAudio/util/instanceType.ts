import { MockWebAudioApi } from "../api/mockApiType"

/**
 * Returns true if value is instance of a constructor
 * from the mock API or an existing class in the global scope
 */
export const isInstanceType = <K extends keyof MockWebAudioApi>(
  value: unknown,
  keyName: K,
  mockApi: MockWebAudioApi
): value is InstanceType<typeof globalThis[K]> =>
  value instanceof mockApi[keyName] || value instanceof globalThis[keyName]
