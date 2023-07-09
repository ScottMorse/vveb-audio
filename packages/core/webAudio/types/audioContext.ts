import { WebAudioImplName, WebAudioMember } from "../api"

/** Metadata about BaseAudioContext subclasses */
export const AUDIO_CONTEXTS = {
  live: {
    constructor: "AudioContext",
  },
  offline: {
    constructor: "OfflineAudioContext",
  },
} as const

/** Type metadata about BaseAudioContext subclasses */
export type AudioContexts = typeof AUDIO_CONTEXTS

/**
 * A name to reference kinds of BaseAudioContext subclasses,
 * "live" referring to AudioContext and "offline" referring
 * to OfflineAudioContext
 */
export type AudioContextName = keyof AudioContexts

/**
 * A reference to the constructor of a BaseAudioContext subclass,
 * optionally from a specific Web Audio implementation (native vs standardized-audio-context)
 *
 * @example
 * import * as StandardizedAudioContext from "standardized-audio-context"
 *
 * const a: AudioContextConstructor = AudioContext
 * const b: AudioContextConstructor = StandardizedAudioContext.AudioContext
 * const c: AudioContextConstructor<"live"> = AudioContext
 * const d: AudioContextConstructor<"live"> = StandardizedAudioContext.AudioContext
 * const e: AudioContextConstructor<"offline"> = OfflineAudioContext
 * const f: AudioContextConstructor<"offline"> = StandardizedAudioContext.OfflineAudioContext
 * const g: AudioContextConstructor<"live", "native"> = AudioContext
 * const g: AudioContextConstructor<"live", "standardized"> = StandardizedAudioContext.AudioContext
 * const h: AudioContextConstructor<"offline", "native"> = OfflineAudioContext
 * const h: AudioContextConstructor<"offline", "standardized"> = StandardizedAudioContext.OfflineAudioContext
 */
export type AudioContextConstructor<
  N extends AudioContextName = AudioContextName,
  W extends WebAudioImplName = WebAudioImplName
> = WebAudioMember<AudioContexts[N]["constructor"], W>

/**
 * A reference to an instance of a BaseAudioContext subclass,
 * optionally from a specific Web Audio implementation (native vs standardized-audio-context)
 *
 * @example
 * import * as StandardizedAudioContext from "standardized-audio-context"
 *
 * const a: AudioContextInstance = new AudioContext()
 * const b: AudioContextInstance = new StandardizedAudioContext.AudioContext()
 * const c: AudioContextInstance<"live"> = new AudioContext()
 * const d: AudioContextInstance<"live"> = new StandardizedAudioContext.AudioContext()
 * const e: AudioContextInstance<"offline"> = new OfflineAudioContext()
 * const f: AudioContextInstance<"offline"> = new StandardizedAudioContext.OfflineAudioContext()
 * const g: AudioContextInstance<"live", "native"> = new AudioContext()
 * const g: AudioContextInstance<"live", "standardized"> = new StandardizedAudioContext.AudioContext()
 * const h: AudioContextInstance<"offline", "native"> = new OfflineAudioContext()
 * const h: AudioContextInstance<"offline", "standardized"> = new StandardizedAudioContext.OfflineAudioContext()
 */
export type AudioContextInstance<
  N extends AudioContextName = AudioContextName,
  W extends WebAudioImplName = WebAudioImplName
> = InstanceType<AudioContextConstructor<N, W>>

/**
 * The options object parameter for a BaseAudioContext subclass
 */
export type AudioContextOptionsObject<N extends AudioContextName> =
  N extends "offline" ? OfflineAudioContextOptions : AudioContextOptions
