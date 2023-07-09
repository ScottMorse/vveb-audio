import { PickAny } from "@@core/internal/util/types"
import type * as StandardizedAudioContext from "standardized-audio-context"

/**
 * An internal type that maps any interfaces available in
 * standardized-audio-context to an unknown implementation.
 *
 * standardized-audio-context contains a subset of the Web Audio API,
 * but the types it uses do not always cleanly swap out with native types,
 * so this type is used to help resolve available interfaces of an API
 * without dictating the implementation.
 */
export type AbstractWebAudioImpl = {
  name: string
  api: {
    // This will be considered the minimum interface of the Web Audio API.
    // standardized-audio-context provides a good baseline for this, since
    // it focuses on the common supported interface cross-browser
    [key in keyof PickAny<
      typeof StandardizedAudioContext,
      keyof typeof globalThis
    >]: unknown
  }
}

/**
 * The name of one of the interfaces minimally offered in the Web Audio API,
 * like "AudioContext", "OscillatorNode", etc. */
export type SupportedWebAudioMemberName = keyof AbstractWebAudioImpl["api"]
