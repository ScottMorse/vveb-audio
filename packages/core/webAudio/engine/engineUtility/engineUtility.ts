import { WebAudioImplName, WebAudioImpl, createWebAudioImpl } from "../../api"

const DEFAULT_WEB_AUDIO_API_NAME = "native" as const

export type DefaultWebAudioName = typeof DEFAULT_WEB_AUDIO_API_NAME

/** Options parameter type to create an Engine */
export interface EngineOptions<W extends WebAudioImplName = WebAudioImplName> {
  /**
   * When "native" is passed (default), the global native Web Audio API is used.
   * When "standard" is passed, the ponyfill library `standardized-audio-context` is used instead.
   */
  api?: W
  audioContext?: {
    /** Options passed to the main context when it is initialized */
    mainContextOptions?: AudioContextOptions
    /**
     * When `true` or `"onCanStart"` (default), the main AudioContext
     * will be initialized after user interaction with the page.
     *
     * When `"immediate"`, the main AudioContext will be initialized
     * immediately regardless of any state.
     *
     * When `false`, the main AudioContext will not be initialized
     * automatically.
     */
    autoInitializeMain?: boolean | "immediate" | "onCanStart"
  }
}

/**
 * Contains data that drives the core utilities,
 * such as the Web Audio API implementation (native vs. standardized-audio-context).
 */
export interface EngineInternals<
  W extends WebAudioImplName = WebAudioImplName
> {
  webAudio: WebAudioImpl<W>
  audioContext: Required<EngineOptions<W>["audioContext"]>
}

/**
 * Create the Engine that contains data that drives core utilities,
 * such as the Web Audio API implementation (native vs. standardized-audio-context).
 */
export const createEngineInternals = <
  W extends WebAudioImplName = DefaultWebAudioName
>(
  options?: EngineOptions<W>
): EngineInternals<W> => ({
  webAudio: createWebAudioImpl(
    (options?.api ?? DEFAULT_WEB_AUDIO_API_NAME) as W
  ),
  audioContext: {
    mainContextOptions: {},
    autoInitializeMain: "onCanStart",
    ...options?.audioContext,
  },
})

/** An internal class for creating utility methods that depend on a shared engine */
export abstract class EngineUtility<
  W extends WebAudioImplName = DefaultWebAudioName
> {
  constructor(protected internals: EngineInternals<W>) {
    this.api = internals.webAudio.api
  }

  protected readonly api: typeof this.internals.webAudio.api

  protected is<W extends WebAudioImplName>(
    type: W
  ): this is this & { api: WebAudioImpl<W>["api"] } {
    return this.internals.webAudio.name === type
  }
}
