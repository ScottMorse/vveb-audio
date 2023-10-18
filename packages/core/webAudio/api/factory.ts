import { ConcreteConstructor } from "@@core/internal/util/types"
import { createNativeWebAudioApi } from "./implementations/native"
import { createStandardizedWebAudioApi } from "./implementations/standardized"

const CONFIG = {
  native: createNativeWebAudioApi,
  standardized: createStandardizedWebAudioApi,
} as const

type Config = {
  native: ReturnType<typeof createNativeWebAudioApi>
  standardized: ReturnType<typeof createStandardizedWebAudioApi>
}

/** The key name of an implementation of the Web Audio API */
export type WebAudioImplName = keyof typeof CONFIG

/** The data of an implementation of the Web Audio API */
export type WebAudioImpl<W extends WebAudioImplName = WebAudioImplName> =
  Config[W]

/**
 * The name of a member of a supported implementation of the Web Audio API,
 * such as 'AudioContext', 'OscillatorNode', etc.
 */
export type WebAudioMemberName<W extends WebAudioImplName = WebAudioImplName> =
  keyof WebAudioImpl<W>["api"]

/**
 * A member of a supported implementation of the Web Audio API.
 * This often resolves to a constructor.
 *
 * @example
 * import * as StandardizedAudioContext from "standardized-audio-context"
 *
 * const anyContextA: WebAudioMember<"AudioContext"> = AudioContext
 * const anyContextB: WebAudioMember<"AudioContext"> = StandardizedAudioContext.AudioContext
 *
 * const nativeContext: WebAudioMember<"AudioContext", "native"> = AudioContext
 * const standardizedContext: WebAudioMember<"AudioContext", "standardized"> = StandardizedAudioContext.AudioContext
 */
export type WebAudioMember<
  M extends WebAudioMemberName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = WebAudioImpl<W>["api"][M]

type WebAudioInstances<W extends WebAudioImplName> = {
  [K in WebAudioMemberName<W>]?: WebAudioMember<
    K,
    W
  > extends ConcreteConstructor
    ? InstanceType<WebAudioMember<K, W>>
    : never
}

/**
 * An instance type of a supported constructor member of an implementation of the Web Audio API.
 *
 * @example
 * import * as StandardizedAudioContext from "standardized-audio-context"
 *
 * const anyContextA: WebAudioInstance<"AudioContext"> = new AudioContext()
 * const anyContextB: WebAudioInstance<"AudioContext"> = new StandardizedAudioContext.AudioContext()
 *
 * const nativeContext: WebAudioInstance<"AudioContext", "native"> = new AudioContext()
 * const standardizedContext: WebAudioInstance<"AudioContext", "standardized"> = new StandardizedAudioContext.AudioContext()
 */
export type WebAudioInstance<
  M extends keyof WebAudioInstances<W>,
  W extends WebAudioImplName = WebAudioImplName
> = Omit<NonNullable<WebAudioInstances<W>[M]>, "createScriptProcessor">

const validateWebAudioName = (name: WebAudioImplName) => {
  if (!CONFIG[name]) {
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
 * const native = createWebAudioApi("native");
 * const standardized = createWebAudioApi("standardized");
 *
 * const nativeContext = new native.api.AudioContext();
 * const standardizedContext = new standardized.api.AudioContext();
 */
export const createWebAudioImpl = <
  W extends WebAudioImplName = WebAudioImplName
>(
  name: W
) => CONFIG[validateWebAudioName(name)]() as WebAudioImpl<W>
