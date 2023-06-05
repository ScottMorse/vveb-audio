import { ConcreteConstructor } from "@@core/internal/util/types"
import { WebAudioApiName, WebAudioApi, createWebAudioApi } from "../api"

const DEFAULT_WEB_AUDIO_API_NAME = "native" as const

export type DefaultWebAudioApiName = typeof DEFAULT_WEB_AUDIO_API_NAME

/** Options parameter type to create an Engine */
export interface EngineOptions<
  W extends WebAudioApiName = DefaultWebAudioApiName
> {
  /**
   * When "native" is passed (default), the global native Web Audio API is used.
   *
   * When "standard" is passed, the library `standardized-audio-context` is used instead.
   */
  api?: W
}

/**
 * Contains data that drives the core utilities,
 * such as the Web Audio API implementation (native vs. standardized-audio-context).
 */
export interface Engine<W extends WebAudioApiName = DefaultWebAudioApiName> {
  api: WebAudioApi<W>
}

/** Create the Engine that contains data that drives core utilities. */
export const createEngine = <
  W extends WebAudioApiName = DefaultWebAudioApiName
>(
  options?: EngineOptions<W>
): Engine<W> => ({
  api: createWebAudioApi((options?.api ?? DEFAULT_WEB_AUDIO_API_NAME) as W),
})

export abstract class EngineUtility<
  W extends WebAudioApiName = DefaultWebAudioApiName
> {
  constructor(protected engine: Engine<W>) {}
}
