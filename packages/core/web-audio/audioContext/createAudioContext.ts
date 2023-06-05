import { getAudioContextConfig } from "./audioContextConfig"
import {
  AudioContextClassOptions,
  AudioContextInstance,
} from "./audioContextTypes"

type CreateAudioContextKindMap = {
  main: "normal"
  normal: "normal"
  offline: "offline"
}

let MAIN_CONTEXT: AudioContext
const resolveMainContext = () => {
  if (!MAIN_CONTEXT) {
    MAIN_CONTEXT = new AudioContext()
  }
  return MAIN_CONTEXT
}

export type CreateAudioContextKind = keyof CreateAudioContextKindMap

export type CreateAudioContextName<K extends CreateAudioContextKind> =
  CreateAudioContextKindMap[K]

/**
 * Create an audio context from its name 'normal' (`AudioContext`) or 'offline' (`OfflineAudioContext`),
 * or use 'main'.
 *
 * When "main" is selected, a singleton AudioContext is returned,
 * which is not instantiated until the call with 'main'.
 *
 * @todo Custom extensions of BaseAudioContext should be supported.
 */
export const createAudioContext = <Kind extends CreateAudioContextKind>(
  contextKind: Kind,
  ...[options]: undefined extends AudioContextClassOptions<
    CreateAudioContextName<Kind>
  >
    ? [options?: AudioContextClassOptions<CreateAudioContextName<Kind>>]
    : [options: AudioContextClassOptions<CreateAudioContextName<Kind>>]
): AudioContextInstance<CreateAudioContextName<Kind>> => {
  if (contextKind === "main") {
    return resolveMainContext() as any
  }
  const config = getAudioContextConfig(contextKind)
  if (!config) {
    throw new Error(`Unsupported AudioContext '${contextKind}'`)
  }
  return new config.cls(options as any) as any
}
