import { createNativeWebAudioApi } from "./implementations/native"
import { createStandardizedWebAudioApi } from "./implementations/standardized"

const CONFIG = {
  native: createNativeWebAudioApi,
  standardized: createStandardizedWebAudioApi,
} as const

type Config = typeof CONFIG

export type WebAudioApiName = keyof typeof CONFIG

export type WebAudioApi<T extends WebAudioApiName = WebAudioApiName> =
  ReturnType<Config[T]>

const validateName = (name: WebAudioApiName) => {
  if (!CONFIG[name as WebAudioApiName]) {
    throw new Error(
      `Unsupported Web Audio API implementation name: "${name}" (available: "${Object.keys(
        CONFIG
      ).join('" | "')}")`
    )
  }
  return name
}

/**
 * Create a collection of interfaces of the Web Audio API, such as AudioContext,
 * OscillatorNode, etc.
 *
 * As of this time, there are two implementations available, "native" and "standardized".
 *
 * The native implementation is the native Web Audio API as implemented by the browser,
 * essentially the same as using the normal global interfaces.
 *
 * The standardized implementation provides a subset of the Web Audio API that is
 * implemented by the library standardized-audio-context. Its interface matches the
 * native interface closely. You must install this library to use this implementation.
 *
 * @example
 * const nativeApi = createWebAudioApi("native");
 * const standardizedApi = createWebAudioApi("standardized");
 *
 * const nativeContext = new nativeApi.AudioContext();
 * const standardizedContext = new standardizedApi.AudioContext();
 */
export const createWebAudioApi = <W extends WebAudioApiName = WebAudioApiName>(
  name: W
) => CONFIG[validateName(name)]() as WebAudioApi<W>
